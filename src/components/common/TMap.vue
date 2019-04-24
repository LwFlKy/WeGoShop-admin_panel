<template>
    <div></div>
</template>
<script>
    var mapLoader = require('./AMap.js')

    module.exports = {
        replace: true,
        ready() {
            var self = this

            mapLoader('bfe31f4e0fb231d29e1d3ce951e2c780').then(AMap => {
                self.map = new AMap.Map(self.$el, {
                    resizeEnable: true,
                    zoom: 12,
                })

                self.map.on('click', function (e) {
                    self.$dispatch('map-click', e)

                    if (!self.marker) {
                        self.marker = new AMap.Marker({ map: self.map })
                    }

                    self.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()])
                })

                self.$nextTick(function () {
                    self.$dispatch('ready', self.map)
                })
            })
        }
    }
</script>