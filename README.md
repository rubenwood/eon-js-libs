# eon-js-libs
EON Studio JS Libraries

This is a utility library for EON Studio.

Usage:

var NU = new NodeUtils(); 

// Create an instance of the NodeUtils object

Now you can access all of the functions within it.

Example:
// Will print the names of all nodes in the simulation

eon.Trace(NU.GetAllNodeNames(NU.GetAllNodes()));

//Disables all nodes starting from rootNode

NU.DisableNodes(NU.GetAllNodes(rootNode));
