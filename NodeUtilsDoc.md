# NodeUtils

The node utils library provides many useful functions. Many of these functions  perform general purpose ‘macro’ actions, for example, where you would usually write a for loop to get all of the nodes in a subtree and push them into an array, or write a loop to store all the fields belonging to a node, you can just use one of the functions in this library.

### Example Usage:
```javscript
// Create an instance of the NodeUtils object
var NU = new NodeUtils(); 
```

Now you can access all of the functions within it.

For example:
```javascript
// Will print the names of all nodes in the simulation
eon.Trace(NU.GetAllNodeNames(NU.GetAllNodes()));

//Disables all nodes starting from rootNode
NU.DisableNodes(NU.GetAllNodes(rootNode));
```
# Setting up

Include this in your includes field

Once included create an instance of the NodeUtils object in your script.
```javascript
var NU = new NodeUtils();
```
From now on, whenever you want to use the NodeUtils object use the instance (variable) name, e.g:
```javacript
NU.GetAllNodes();
```
NOTE: In the case of functions in the other and experimental sections you won’t need to use the NodeUtils object.

# Functions

GetSim  
<i>Returns the simulation node (regardless of name)</i>

GetAllNodes  
<i>Returns an array of all of the nodes in the subtree, starting at a root node</i>

GetAllNodeNames  
<i>Returns an array of all of the names of nodes in a list of nodes</i>

CollectionToArray  
<i>Converts a collection object into an array</i>

GetAllNodePaths  
<i>Returns an array of node paths (strings) in an array of nodes</i>

compareNodes  
<i>Compares 2 nodes, returns true if they are the same node, false otherwise</i>

swapNodes  
<i>Swaps two nodes in the simulation tree</i>

swapRefs  
<i>Swaps the references in one field with another field of the same type, works for both single field and multiple field</i>

EnableNodes  
<i>Enables all nodes in an array  </i>
<i>Sets fields; Enabled, enabled, Enable, Active, active and SetRun to true  </i>
<i>Sets field; SetRun_ to false </i> 

DisableNodes  
<i>Disables all nodes in an array (opposite of Enable nodes)  </i>
<i>Sets fields; Enabled, enabled, Enable, Active, active and SetRun to false  </i>
<i>Sets field; SetRun_ to true  </i>

GetNodesWithField  
<i>Returns an array of nodes possessing a certain field</i>

GetNodesWithFields 
<i>Returns an array of nodes possessing all fields </i>

GetAllFields  
<i>Returns an array of all fields belonging to a node</i>

GetAllFieldNames  
<i>Returns an array of all of the names (strings) of a list of fields</i>

CopyToParent 
<i>Copies a node to its parent node</i>

CopyToAllChildren  
<i>Copies a node to all of the children of a root node</i>

MultCopy  
<i>Performs a eon.CopyNode multiple times</i>
<i>Works exactly like copy node, just add a number of copies you would like to create</i>

hasRB  
<i>Checks to see if a node has a rigid body as a child (return true if found, false otherwise)</i>

getFirstRBOfNode  
<i>Returns the first rigid body starting from a root node</i>

GetNodeType  
<i>NOT IMPLEMENTED</i>

# Other

calcDistance3D  
<i>Calculates the distance between two 3-dimensional points</i>

midpoint3D  
<i>Calculates the midpoint of a line between two 3-dimensional points</i>


# Experimental

depth  
<i>Returns the number (int) of levels deep a node is in the simulation tree</i>

traverses  
<i>Returns the number of traverses required to reach a node using eon.FindNode (breadth first)</i>
