'use strict'

/* global Inferno, _elm_lang$core$Native_List, jss, jssNested */

/* Represents a program whose architecture is based on a map which contains
   data for components identified by their unique id.
*/
class Program {
  /* Creates a program from a base tree */
  constructor (rootComponent) {
    this.container = this.createContainer()
    this.root = rootComponent

    this.styles = new Map()
    this.index = 0

    this.ids = new Set()
    this.map = new Map()

    this.setupJss()

    this.render()
  }

  setupJss () {
    this.jss = jss.create()
    this.jss.use(jssNested.default())
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

  /* Updates data of a component at a given branch

     @param {ElmObject} msg - The message for the component at the branch
     @param {String} id - The id of the component
  */
  update (msg, id) {
    // Don't update anything if the component is no longer present
    if (!this.map.has(id)) { return }

    // Get the instance
    var instance = this.map.get(id)
    var component = instance.component

    // Update the component, the return value contains the updated data,
    // the side effect tasks and the event tasks
    var data = component.update(msg)(instance.data)

    // Process the side effect tasks
    _elm_lang$core$Native_List
        .toArray(data.effects)
        .map(function (task) {
          // TODO: Nicer error handling
          task.fork(console.error, function (value) {
            if(value.ctor === "_Tuple2") {
              this.update(value._1, id + "::" + value._0.ctor)
            } else {
              this.update(value, id)
            }
          }.bind(this))
        }.bind(this))

    // Update the map with the new data
    this.map.set(
      id,
      {
        parent: instance.parent,
        component: component,
        data: data.model
      }
    )

    // Process the event tasks
    if (component.listener && this.map.has(instance.parent)) {
      _elm_lang$core$Native_List
        .toArray(data.events)
        .map(function (task) {
          // TODO: Nicer error handling
          task.fork(console.error, function (msg) {
            this.update(component.listener(msg), instance.parent)
          }.bind(this))
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

        if (parentId) {
          id = parentId + '::' + item.id("").ctor
        } else {
          id = item.id("").ctor
        }

        if (this.ids.has(id)) {
          console.warn(
            [ 'The id "' + id + '" has been used before. ',
              'This can lead to wierd behaviour!!!'
            ].join('')
          )
        }

        this.ids.add(id)

        // If there is no data set it
        if (!this.map.has(id)) {
          this.map.set(
            id,
            {
              component: item,
              data: item.model,
              parent: parentId
            }
          )
        }

        // Render the component with the current data and transform it's
        // children
        var instance = this.map.get(id)
        return this.transformElement(
          item.view(instance.data),
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
            attributes.className = rule.className
          } else {
            rule = this.transformStyles(item.styles)
            this.styles.set(styleHash, rule)
            attributes.className = rule.className
          }
        }

        // Create virtual dom element
        return Inferno.createElement(
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
          case 'Property':
            result[attribute._0] = attribute._1
            break

          case 'Event':
            // Wire in the event to the update.
            result['on' + attribute._0] = function (event) {
              // TODO: handle stopPropagation, stopImmediatePropagation,
              // preventDefault here
              this.update(attribute._1(event), id)
            }.bind(this)
            break
        }
      }.bind(this))

    return result
  }

  /* Renders the program into the container */
  render () {
    this.ids.clear()

    Inferno.render(this.transformElement(this.root), this.container)

    for (var key of this.map.keys()) {
      if (this.ids.has(key)) { continue }
      this.map.delete(key)
    }
  }
}

if (typeof module !== 'undefined') {
  global.Inferno = require('inferno')
  global.Inferno.createElement = require('inferno-create-element')
  global.jss = require('jss')
  global.jssNested = require('jss-nested')

  global._elm_lang$core$Native_List = {
    toArray: function (a) { return a }
  }
  module.exports = Program
}
