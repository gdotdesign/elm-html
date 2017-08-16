/*
  Represents a program whose architecture is based on a map which contains
  data for components identified by their position in the tree.

  Take this example:

    <div> - 0
      <component-1> - 0-0
        <div></div> - 0-0-0
        <div> - 0-0-1
          <component-2>Some text</component-2> - 0-0-1-0
          <component-2>Some text</component-2> - 0-0-2-0
        </div>
      </component-1>
    </div>

  The data for the program looks like this:

    {
      '0-0': {.. data for an instance of component-1 ..},
      '0-0-1-0': {.. data for an instance component-2 ..}
      '0-0-2-0': {.. data for an instance component-2 ..}
    }

  Logic for component lifecycle:
  * Components implement their own TEA which is used to update the data
    of their instance in the map.
  * Components are identified by unique IDs which can be manually set
    or generated.
  * The data is deleted when no component is not associated the leaf
  * The data is reset when an other components is associated the leaf

  This program uses:
  - InfernoJS for rendering
  - TODO: JSS for styling elements
*/
class Program {
  /* Creates a program from a base tree */
  constructor (rootComponent) {
    this.container = this.createContainer()
    this.root = rootComponent
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
     @param {String} branch - The branch to update
     @param {String} uid - The unique identifier of the component
  */
  update (msg, branch, uid) {
    // Don't update anything if the component doesn't own the branch
    if (this.isBranchStale(branch, uid)) { return }

    // Get the instance
    var instance = this.map.get(branch)

    // Update the component the, return value contains the updated data
    // and maybe a promise
    var data = instance.component.update(msg)(instance.data)

    // If there is a promise, schedule an update after it resolves
    switch (data._1.ctor) {
      case "Just":
        data._1._0.then(function(resultMsg){
          this.update(resultMsg, branch, uid)
        }.bind(this))
    }

    // Update the branch with the new data
    this.map.set(
      branch,
      { component: instance.component,
        data: data._0 }
    )

    // Render - TODO: Just schedule on requestAnimationFrame
    this.render()
  }

  /* Tests if the given branch belongs to the component with the given uid.

     @param {String} branch - The branch
     @param {String} uid - The unique identifier of the component
  */
  isBranchStale (branch, uid) {
    var instance = this.map.get(branch)
    return !instance || instance.component.uid !== uid
  }

  /* Transforms elements from Elm representation into virtual dom elements.

     @param {ElmList} elements - The elements to transform
     @param {String} branch - The parent branch
     @param {String} uid - The unique identifier of the parent component
  */
  transformElements(elements, branch, uid) {
    return _elm_lang$core$Native_List
      .toArray(elements)
      .map(function(element, index){
        return this.transformElement(element, branch + "-" + index)
      }.bind(this))
  }

  /* Transforms an element into a virtual dom element.

     @param {ElmHtml} element - The element to transform
     @param {String} branch - The parent branch
     @param {String} uid - The unique identifier of the parent component
     @param {Boolean} isComponent
      This function is used to transform the rendered component, true if it's
      that transformation else false
  */
  transformElement(element, branch, uid, isComponent) {
    var item = element._0

    switch (element.ctor) {
      // Text
      case "T":
        return item

      // Component
      case "C":
        // If branch is stale set data
        if (this.isBranchStale(branch, item.uid)) {
          this.map.set(
            branch,
            { component: item,
              data: item.model }
          )
        }

        // Render the component with the current data and transform it's
        // children
        var instance = this.map.get(branch)

        return this.transformElement(
          item.view(instance.data),
          branch,
          instance.component.uid,
          true
        )

      // Element
      case "E":
        // We don't have a component at this point so it's safe to delete
        // the data if it exists and we are not transformin a component
        if (!isComponent) { this.map.delete(branch) }

        // Create virtual dom element
        return Inferno.createElement(
          item.tag,
          this.transformAttributes(item.attributes, branch, uid),
          this.transformElements(item.contents, branch, uid)
        )
    }
  }

  /* Transforms attributes of an element from Elm representation into virtual
     dom events and attributes.

     @param {ElmAttribute} attributes - The attributes to transform
     @param {String} branch - The parent branch
     @param {String} uid - The unique identifier of the parent component
  */
  transformAttributes(attributes, branch, uid) {
    var result = {}

    _elm_lang$core$Native_List
      .toArray(attributes)
      .forEach(function(attribute){
        switch (attribute.ctor) {
          case "Event":
            // Wire in the event to the update.
            result[attribute._0] = function(event) {
              // TODO: handle stopPropagation, stopImmediatePropagation,
              // preventDefault here
              this.update(attribute._1(event), branch, uid)
            }.bind(this)
          break
        }
      }.bind(this))

    return result
  }

  /* Renders the program into the container */
  render () {
    var vdom = this.transformElement(this.root, "0", "root")
    Inferno.render(vdom, this.container)
  }
}

/* Native Elm interface. */
var _gdotdesign$elm_html$Native_Html = (function () {
  function program(tree) {
    return function() {
      return function(object) {
        object.fullscreen = function(){
          window.program = new Program(tree)
        }
      }
    }
  }

  function component(comp) {
    comp.uid = _gdotdesign$elm_html$Native_Uid.uid()
    return comp
  }

  return {
    component: component,
    program: program
  }
}())
