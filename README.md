# eon-js-libs
EON Studio JS Libraries

Here you will find various javascript libraries for use in EON Studio.

The EONLibrary and EON10Library files are really useful libraries created by Jaymie Timperly and other former EONites. They stil work and have there own documentation (coming soon)

The Node Utils library was created by myself to perform various actions I find I need often when writing scripts in EON Studio.
More documentation coming soon.

# Node Utils

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

EONLibrary.js (and EONLibrary.min.js)

- Jaymies EON library for EON Studio 9. Also has minified version. 
