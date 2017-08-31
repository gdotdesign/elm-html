var _gdotdesign$elm_html$Native_Components_GoogleMaps =
  { component:
      class GoogleMaps extends Inferno.Component {
        constructor (props) {
          super(props)
          this.centerChanged = true
          this.zoomLevelChanged = true
        }

        shouldComponentUpdate (nextProps, nextState) {
          this.centerChanged = nextProps.center != this.props.center
          this.zoomLevelChanged = nextProps.zoomLevel != this.props.zoomLevel
          return true
        }

        componentDidUpdate () {
          if (this.centerChanged) {
            this.map.setCenter(this.props.center)
          }

          if (this.zoomLevelChanged) {
            this.map.setZoom(this.props.zoomLevel)
          }
        }

        componentDidMount () {
          this.map = new google.maps.Map(this._vNode.dom)
          this.componentDidUpdate()
        }

        render() {
          return Inferno.createElement("div", { style: { width: '100%', height: '400px' }}, '')
        }
      }
  }
