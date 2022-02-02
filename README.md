# OctoPrint-TabInfo

TabInfo shows information about your printer in the browser tab.
The information displayed can be changed using format strings.

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or manually using this URL:

    https://github.com/dakhnod/OctoPrint-TabInfo/archive/master.zip


## Configuration

The plugin can be configured in OctoPrint's settings using format strings.
Currently, two format strings can be defined, one for the Printing state and one for Idle state.
The format string can be any text. everything inside curly brackets is replaced by it's value in a data object.
That data object can be printed to the browsers developer console by ticking the checkbox.
In Chrome, the developer console can be accessed by pressing F12.

Two special cases are relevat:
- when the path points to a zero-argument function, the function is called and the result is used
- when the path points to a float, the value is floored. For instance, 1.123 would become 1
