
The node utils library provides many useful functions. Many of these functions  perform general purpose ‘macro’ actions, for example, where you would usually write a for loop to get all of the nodes in a subtree and push them into an array, or write a loop to store all the fields belonging to a node, you can just use one of the functions in this library.

Usage:

var NU = new NodeUtils(); 

// Create an instance of the NodeUtils object

Now you can access all of the functions within it.

Example:

// Will print the names of all nodes in the simulation

eon.Trace(NU.GetAllNodeNames(NU.GetAllNodes()));

//Disables all nodes starting from rootNode

NU.DisableNodes(NU.GetAllNodes(rootNode));
