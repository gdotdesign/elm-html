var _gdotdesign$elm_html$Native_Components_GoogleMaps =
  { component:
      class GoogleMaps extends Inferno.Component {
        componentDidUpdate () {
          if (this.center.lat != this.props.center.lat &&
              this.center.lng != this.props.center.lng) {
            this.map.setCenter(this.props.center)
          }

          if (this.zoomLevel != this.props.zoomLevel) {
            this.map.setZoom(this.props.zoomLevel)
          }
        }

        componentDidMount () {
          this.map = new google.maps.Map(this._vNode.dom)

          this.map.addListener('center_changed', function(){
            if (this.props.onCenterChange.ctor === 'Just') {
              this.props._update(this.props.onCenterChange._0(this.center))
            }
          }.bind(this))

          this.map.addListener('zoom_changed', function(){
            if (this.props.onZoomLevelChanged.ctor === 'Just') {
              this.props._update(this.props.onZoomLevelChanged._0(this.zoomLevel))
            }
          }.bind(this))

          this.componentDidUpdate()
        }

        get zoomLevel () {
          return this.map.getZoom()
        }

        get center () {
          var center = this.map.getCenter()
          return { lat: center && center.lat(), lng: center && center.lng() }
        }

        render() {
          return Inferno.createElement("div", { style: { width: '100%', height: '80vh' }}, '')
        }
      }
  }
