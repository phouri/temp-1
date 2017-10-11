const mapSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1ECSGppdpqz0-T0GxqJWc4_SObmZ7HdQ&libraries=visualization';
const mapId = 'google-maps';

export default {
  name: 'heatmap',
  props: [],
  mounted() {
    let mapScriptNode = document.getElementById(mapId);
    const onLoad = () => {
      mapScriptNode.setAttribute('loaded', true);
      this.onScriptReady();
      mapScriptNode.removeEventListener('load', onLoad);
    };
    if (!mapScriptNode) {
      mapScriptNode = document.createElement('script');
      mapScriptNode.setAttribute('type', 'text/javascript');
      mapScriptNode.setAttribute('async', true);
      mapScriptNode.setAttribute('defer', true);
      mapScriptNode.id = mapId;
      mapScriptNode.src = mapSrc;
      mapScriptNode.addEventListener('load', onLoad);
      document.body.appendChild(mapScriptNode);
    } else if (mapScriptNode.getAttribute('load')) {
      this.onScriptReady();
    } else {
      mapScriptNode.addEventListener('load', onLoad);
    }
  },
  data() {
    return {
      scriptLoaded: false,
    };
  },
  methods: {
    onScriptReady() {
      this.scriptLoaded = true;
      if (this.points) {
        this.drawMap(this.points);
      }
    },
    drawMap() {
      const points = this.points;
      if (!this.scriptLoaded || !points || !points.length) {
        return;
      }
      const lngAvg = points.map(p => p.lng).reduce((a, b) => a + b) / points.length;
      const latAvg = points.map(p => p.lat).reduce((a, b) => a + b) / points.length;
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
          lat: latAvg,
          lng: lngAvg,
        },
        mapTypeId: 'satellite',
      });
      const ps = points.map((p) => {
        return {
          location: new window.google.maps.LatLng(p.lat, p.lng),
          weight: p.weight,
        };
      });
      /* eslint-disable no-new */
      new window.google.maps.visualization.HeatmapLayer({
        data: ps,
        map,
      });
    },
  },
  watch: {
    points(points) {
      this.drawMap(points);
    },
  },
  computed: {
    points() {
      return this.$store.state.heatmapPoints;
    },
    shouldShowMap() {
      return this.points && this.points.length && this.scriptLoaded;
    },
  },
};
