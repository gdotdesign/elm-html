'use strict'

/* global Inferno, _elm_lang$core$Native_List */

/*
  Represents a program whose architecture is based on a map which contains
  data for components identified by their unique id.

  This program uses:
  - InfernoJS for rendering
  - TODO: JSS for styling elements
*/
class Program {
  /* Creates a program from a base tree */
  constructor (rootComponent) {
    this.container = this.createContainer()
    this.listeners = new Map()
    this.root = rootComponent
    this.ids = new Set()
    this.map = new Map()
    this.render()
  }

  /* Create and inject a container element into the body, this is needed
     because of InfernoJS. */
  createContainer () {
    var element = document.createElement('div')
    document.body.appendChild(element)
    return element
  }

  /* Updates data of a component at a given branch

     @param {ElmObject} msg - The message for the component at the branch
     @param {String} id - The id of the component
  */
  update (msg, id, tagger) {
    // Don't update anything if the component doesn't own the data
    if (!this.map.has(id)) { return }

    // Get the instance
    var instance = this.map.get(id)

    if (tagger) { msg = tagger(msg) }

    // Update the component the, return value contains the updated data
    // and maybe a promise
    var data = instance.component.update(msg)(instance.data)

    // If there is a promise, schedule an update after it resolves
    _elm_lang$core$Native_List
        .toArray(data._1)
        .map(function (promise) {
          promise.then(function (resultMsg) {
            this.update(resultMsg, id)
          }.bind(this))
        }.bind(this))

    // Update the map with the new data
    this.map.set(
      id,
      { component: instance.component,
        data: data._0 }
    )

    // Notify listener parent
    var listenerId = this.listeners.get(id)
    var listener = this.map.get(listenerId)
    if (instance.component.listener && listener) {
      _elm_lang$core$Native_List
        .toArray(data._2)
        .map(function (promise) {
          promise.then(function (msg) {
            this.update(instance.component.listener(msg), listenerId)
          }.bind(this))
        }.bind(this))
    }

    // Render - TODO: Just schedule on requestAnimationFrame
    this.render()
  }

  /* Transforms elements from Elm representation into virtual dom elements.

     @param {ElmList} elements - The elements to transform
     @param {String} parentId - The id of the parent component
  */
  transformElements (elements, parentId, tagger) {
    return _elm_lang$core$Native_List
      .toArray(elements)
      .map(function (element, index) {
        return this.transformElement(element, parentId, tagger)
      }.bind(this))
  }

  /* Transforms an element into a virtual dom element.

     @param {ElmHtml} element - The element to transform
     @param {String} parentId - The id of the parent component
  */
  transformElement (element, parentId, tagger) {
    var item = element._0

    switch (element.ctor) {
      // Text
      case 'T':
        return item

      // Controlled Component
      case 'CC':
        return this.transformElement(
          item.view(item.model),
          parentId,
          item.listener
        )

      // Component
      case 'C':
        if (parentId) {
          item.id = parentId + '::' + item.id
        }

        if (this.ids.has(item.id)) {
          console.warn(
            [ 'The id "' + item.id + '"" has been used before. ',
              'This can lead to wierd behaviour!!!'
            ].join('')
          )
        }

        this.ids.add(item.id)
        this.listeners.set(item.id, parentId)

        // If there is no data set it
        if (!this.map.has(item.id)) {
          this.map.set(
            item.id,
            { component: item,
              data: item.model }
          )
        }

        // Render the component with the current data and transform it's
        // children
        var instance = this.map.get(item.id)
        return this.transformElement(
          item.view(instance.data),
          item.id
        )

      // Element
      case 'E':
        // Create virtual dom element
        return Inferno.createElement(
          item.tag,
          this.transformAttributes(item.attributes, parentId, tagger),
          this.transformElements(item.contents, parentId, tagger)
        )
    }
  }

  /* Transforms attributes of an element from Elm representation into virtual
     dom events and attributes.

     @param {ElmAttribute} attributes - The attributes to transform
     @param {String} id - The id of the component
  */
  transformAttributes (attributes, id, tagger) {
    var result = {}

    _elm_lang$core$Native_List
      .toArray(attributes)
      .forEach(function (attribute) {
        switch (attribute.ctor) {
          case 'Event':
            // Wire in the event to the update.
            result[attribute._0] = function (event) {
              // TODO: handle stopPropagation, stopImmediatePropagation,
              // preventDefault here
              this.update(attribute._1(event), id, tagger)
            }.bind(this)
            break
        }
      }.bind(this))

    return result
  }

  /* Renders the program into the container */
  render () {
    this.ids.clear()
    var vdom = this.transformElement(this.root)
    Inferno.render(vdom, this.container)
    for (var key of this.map.keys()) {
      if (this.ids.has(key)) { continue }
      this.map.delete(key)
    }
  }
}

if (typeof module !== 'undefined') {
  global.Inferno = require('inferno')
  global.Inferno.createElement = require('inferno-create-element')

  global._elm_lang$core$Native_List = {
    toArray: function (a) { return a }
  }
  module.exports = Program
}
