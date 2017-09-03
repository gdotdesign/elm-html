'use strict'

/* global _elm_lang$core$Native_List, AbortProcess */

/* Represents a program */
class Program { // eslint-disable-line
  /* Creates a program from a base tree */
  constructor (rootComponent) {
    this.inferno = (window.Inferno || exports.Inferno)
    this.container = this.createContainer()
    this.root = rootComponent

    this.styles = new Map()
    this.index = 0

    this.subscriptions = new Map()
    this.processes = new Map()
    this.ids = new Set()
    this.map = new Map()

    this.setupJss()

    this.render()
  }

  setupJss () {
    this.jss = (window.jss || exports.jss).create()
    this.jss.use((window.jssNested || exports.jssNested).default())
    this.jss.setup({
      generateClassName: function (rule) {
        return 's-' + rule.name
      }
    })
    this.sheet = this.jss.createStyleSheet({}, { link: true })
    this.sheet.attach()
  }

  /* Create and inject a container element into the body, this is needed
     because of InfernoJS.
  */
  createContainer () {
    var element = document.createElement('div')
    document.body.appendChild(element)
    return element
  }

  /* Handles an update.

     @param {ElmObject} msg - The message for the component at the branch
     @param {String} id - The id of the component
  */
  update (msg, id) {
    // Don't do anything, if we don't have the component
    if (!this.map.has(id)) { return }

    // Get the instance of the component
    var instance = this.map.get(id)
    var component = instance.component

    // Update the component data.
    var data = component.update(msg)(instance.props)(instance.state)

    // Create new object in the map with the new state
    this.map.set(id,
      {
        parent: instance.parent,
        props: instance.props,
        component: component,
        state: data.state
      }
    )

    // Process the side effect tasks
    for (let task of _elm_lang$core$Native_List.toArray(data.effects)) {
      // TODO: Nicer error handling
      task.fork(console.error, function (value) {
        this.update(value, id)
      }.bind(this))
    }

    // Process the command tasks
    for (let task of _elm_lang$core$Native_List.toArray(data.commands)) {
      // TODO: Nicer error handling
      task.fork(console.error, function (value) {
        this.update(value._0, id + '::' + value.ctor)
      }.bind(this))
    }

    // Process the processes tasks
    for (let item of _elm_lang$core$Native_List.toArray(data.processes)) {
      let proc = item._1()
      let procId = id + '--' + item._0

      if (proc instanceof AbortProcess) {
        let runningProc = this.processes.get(procId)
        if (runningProc) { runningProc.abort() }
      } else {
        this.processes.set(procId, proc)

        proc.run(
          function (processMsg) {
            this.update(processMsg, id)
          }.bind(this),
            function () {
              this.processes.delete(procId)
            }.bind(this)
        )
      }
    }

    // Process the parent messages
    for (let task of _elm_lang$core$Native_List.toArray(data.parentMessages)) {
      // TODO: Nicer error handling
      task.fork(console.error, function (msg) {
        this.update(msg, instance.parent)
      }.bind(this))
    }

    // Schedule a render
    // TODO: Just schedule on requestAnimationFrame
    this.render()
  }

  /* Transforms elements from Elm representation into virtual dom elements.

     @param {ElmList} elements - The elements to transform
     @param {String} parentId - The id of the parent component
  */
  transformElements (elements, parentId) {
    return _elm_lang$core$Native_List
      .toArray(elements)
      .map(function (element, index) {
        return this.transformElement(element, parentId)
      }.bind(this))
  }

  /* Transforms an element into a virtual dom element.

     @param {ElmHtml} element - The element to transform
     @param {String} parentId - The id of the parent component
  */
  transformElement (element, parentId) {
    var item = element._0

    switch (element.ctor) {
      case 'F':
        item.props._update = function(msg){
          this.update(msg, parentId)
        }.bind(this)

        return this.inferno.createElement(item.component, item.props)

      // Text
      case 'T':
        return item

      // Embed
      case 'EM':
        var component = this.map.get(parentId)
        return this.transformElement(item, component.parent)

      // Component
      case 'C':
        var id

        var data = item.id('')
        var ctorId = data.ctor
        var index = 0
        var part

        while (part = data['_' + index]) { // eslint-disable-line
          ctorId += part
          index++
        }

        if (parentId) {
          id = parentId + '::' + ctorId
        } else {
          id = ctorId
        }

        if (this.ids.has(id)) {
          console.warn(
            [ 'The id "' + id + '" has been used before. ',
              'This can lead to wierd behaviour!!!'
            ].join('')
          )
        }

        this.ids.add(id)

        // If there is no state set the defaults
        if (!this.map.has(id)) {
          this.map.set(id, { state: item.initialState, props: item.props })
        }

        // Render the component with the current state and transform it's children
        var instance = this.map.get(id)

        this.map.set(
          id,
          {
            state: instance.state,
            props: item.props,
            component: item,
            parent: parentId
          }
        )

        var subscriptions =
          _elm_lang$core$Native_List.toArray(item.subscriptions(item.props)(instance.state))

        for (let subscription of subscriptions) {
          if (!this.subscriptions.has(subscription.function)) {
            this.subscriptions.set(subscription.function, [])
          }

          this
            .subscriptions
            .get(subscription.function)
            .push([id, subscription.msg])
        }

        return this.transformElement(
          item.view(item.props)(instance.state),
          id
        )

      // Element
      case 'E':
        var attributes = this.transformAttributes(item.attributes, parentId)
        var styleHash = JSON.stringify(item.styles)
        var rule

        if (item.styles._0) {
          if (this.styles.has(styleHash)) {
            rule = this.styles.get(styleHash)
          } else {
            rule = this.transformStyles(item.styles)
            this.styles.set(styleHash, rule)
          }
        }

        if (rule) {
          attributes.className = rule.className
        }

        // Create virtual dom element
        return this.inferno.createElement(
          item.tag,
          attributes,
          this.transformElements(item.contents, parentId)
        )
    }
  }

  /* Transform styles of an element.
  */
  transformStyles (styles) {
    var data = {}

    for (var style of _elm_lang$core$Native_List.toArray(styles)) {
      switch (style.selector.ctor) {
        case 'Self':
          for (var tuple of _elm_lang$core$Native_List.toArray(style.data)) {
            data[tuple._0] = tuple._1
          }
          break

        case 'Child':
          data['& ' + style.selector._0] = this.transformStyleBody(style.data)
          break

        case 'Pseudo':
          data['&' + style.selector._0] = this.transformStyleBody(style.data)
      }
    }

    return this.sheet.addRule(this.index++, data)
  }

  transformStyleBody (data) {
    var body = {}

    for (var tuple of _elm_lang$core$Native_List.toArray(data)) {
      body[tuple._0] = tuple._1
    }

    return body
  }

  /* Transforms attributes of an element from Elm representation into virtual
     dom events and attributes.

     @param {ElmAttribute} attributes - The attributes to transform
     @param {String} id - The id of the component
  */
  transformAttributes (attributes, id) {
    var result = {}

    _elm_lang$core$Native_List
      .toArray(attributes)
      .forEach(function (attribute) {
        switch (attribute.ctor) {
          case 'Attribute':
            result[attribute._0] = attribute._1
            break

          case 'BoolAttribute':
            if (attribute._1) { result[attribute._0] = attribute._1 }
            break

          case 'Property':
            result[attribute._0] = attribute._1
            break

          case 'Event':
            // Wire in the event to the update.
            result['on' + attribute._0] = function (event) {
              var tuple = attribute._1(event)

              for (var key in tuple._1) {
                if (tuple._1[key]) { event[key]() }
              }

              var result = tuple._0
              switch (result.ctor) {
                case 'Just':
                  this.update(result._0, id)
              }
            }.bind(this)
            break
        }
      }.bind(this))

    return result
  }

  /* Renders the program into the container */
  render () {
    // Geather the subscription keys
    let subscriptionKeys = new Set()
    for (let key of this.subscriptions.keys()) {
      subscriptionKeys.add(key)
    }

    // Clear temp variables
    this.ids.clear()
    this.subscriptions.clear()

    // Render the VDOM
    this.inferno.render(this.transformElement(this.root), this.container)

    // Update subscriptions
    for (let [key, value] of this.subscriptions.entries()) {
      subscriptionKeys.delete(key)
      key(this, value)
    }

    // Clear up not used subscriptions
    for (let key of subscriptionKeys) {
      key(this, [])
    }

    // Clear up not used ids
    for (let key of this.map.keys()) {
      if (this.ids.has(key)) { continue }
      this.map.delete(key)
    }
  }
}
