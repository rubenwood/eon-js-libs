# eon-js-libs
EON Studio JS Libraries

This is a utility library for EON Studio. Created by me.

Usage:

var NU = new NodeUtils(); 

// Create an instance of the NodeUtils object

Now you can access all of the functions within it.

Example:
// Will print the names of all nodes in the simulation

eon.Trace(NU.GetAllNodeNames(NU.GetAllNodes()));

//Disables all nodes starting from rootNode

NU.DisableNodes(NU.GetAllNodes(rootNode));


# Other Files

Utilities_not_mobile.js

- An old utilities library that does not work on mobile, but may still be of some use.

EON10Library.js

- Jaymies EON library updated for EON Studio 10.

EONLibrary.js

- Jaymies EON library for EON Studio 9.
