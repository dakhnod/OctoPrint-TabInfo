$(function () {
    function TabInfoViewModel(parameters) {
        var self = this;
        console.log('tabinfo loaded');

        self.title = ko.observable('OctoPrint')

        self.settings = parameters[0]

        parameters[1].title = self.title

        self.propertyCache = {}

        self.enrichDataObject = function (settings, state_data) {
            var bindingObject = {}
            for (var key in state_data) bindingObject[key] = state_data[key]
            bindingObject.settings = settings
            bindingObject.progress.printTimeLeftFuzzy = formatFuzzyPrintTime(state_data.progress.printTimeLeft)
            bindingObject.progress.printTimeLeftFormated = formatDuration(state_data.progress.printTimeLeft)

            return bindingObject
        }

        self.findPropertyByPath = function (path, object) {
            if (path == '') {
                return object
            }
            var parts = path.split('.')
            try {
                for (var part of parts) {
                    object = object[part.trim()]
                }
            } catch (TypeError) {
            }
            if(object === undefined){
                object = self.propertyCache[path]
            }
            if (typeof object === 'function' && object.length == 0) {
                object = object()
            }
            if(typeof object === 'number'){
                object = Math.floor(object)
            }
            self.propertyCache[path] = object
            return object
        }

        self.fillInTemplate = function (templateString, bindingObject) {
            var matches = templateString.match(/{.*?}/g)

            for (var match of matches) {
                var path = match.substr(1, match.length - 2)
                var property = self.findPropertyByPath(path, bindingObject)
                templateString = templateString.replace(match, property)
            }

            return templateString
        }

        self.fromCurrentData = function (data) {
            if (self.template_idle == undefined) {
                self.template_idle = self.settings.settings.plugins.tabinfo.template_idle
            }
            if (self.template_printing == undefined) {
                self.template_printing = self.settings.settings.plugins.tabinfo.template_printing
            }
            if (self.log_binding == undefined) {
                self.log_binding = self.settings.settings.plugins.tabinfo.log_binding
            }

            var is_printing = data.state.flags.printing

            var bindingObject = self.enrichDataObject(self.settings, data)
            if(self.log_binding() == '1'){
                console.log(bindingObject)
            }

            if (is_printing) {
                var templateString = self.template_printing()
            } else {
                var templateString = self.template_idle()
            }
            self.title(self.fillInTemplate(templateString, bindingObject))
        }
    }

    // This is how our plugin registers itself with the application, by adding some configuration
    // information to the global variable OCTOPRINT_VIEWMODELS
    OCTOPRINT_VIEWMODELS.push({
        construct: TabInfoViewModel,
        dependencies: ['settingsViewModel', 'appearanceViewModel']
    });
});
