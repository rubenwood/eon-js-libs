# EON NodeUtils (eonNU)

The node utils library provides many useful functions. Many of these functions  perform general purpose ‘macro’ actions, for example, where you would usually write a for loop to get all of the nodes in a subtree and push them into an array, or write a loop to store all the fields belonging to a node, you can just use one of the functions in this library.

### Example Usage:
Use these methods as you would any regular eon method. 

Functions in the EON Object section are preceded by the eon object, i.e; "<i>eon.</i>GetSimData()"

Functions in the NODE Object section are preceded by a node object, i.e; "<i>eon.FindNode("Camera").</i>GetAllFieldNames()"

Functions in the FIELD Object section are preceded by a field object, i.e; "<i>eon.FindNode("Camera").GetFieldByName("Position").</i>randv3()"
```javascript
var allnodes = eon.GetAllNodes();

// Will print the names of all nodes in the simulation
eon.Trace(eon.GetAllNodeNames(eon.GetAllNodes()));

//Disables all nodes starting from rootNode
eon.DisableNodes(eon.GetAllNodes(rootNode));
```
# Setting up

Include this in your includes field, once included call the methods as usual
```javascript
var allnodes = eon.GetAllNodes();
```
NOTE: In the case of functions in the other and experimental sections you won’t need to use the NodeUtils object.

# Functions

## EON Object, all of these begin with eon.

GetSim  
<i>Returns the simulation node (regardless of name)</i>

GetSimData  
<i>Returns the statistics data of the simulation (String Array)</i> 

fps  
<i>Returns the current fps</i>

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

## NODE Object

setFOV  
<i>If the node is a camera then set its fov to input value</i>

GetAllFields  
<i>Returns an array of all fields belonging to a node</i>

GetAllFieldNames  
<i>Returns an array of all the field names belonging to a node</i>

## FIELD Object

randV3  
<i>Randomize values in SFVec3, between 0 and 1</i>

randV2  
<i>Randomize values in SFVec2, between 0 and 1</i>

randFloat  
<i>Randomize float value, betwen 0 and 1</i>

GetTypeStr  
<i>Returns the dataype of the field as a string value</i>

## Other

calcDistance3D  
<i>Calculates the distance between two 3-dimensional points</i>

midpoint3D  
<i>Calculates the midpoint of a line between two 3-dimensional points</i>


## Experimental

hasRB
<i>This function checks if a node has a rigidbody child, returns true if so, else false</i>

getFirstRBOfNode
<i>This function returns the first rigidbody of a node</i>

depth  
<i>Returns the number (int) of levels deep a node is in the simulation tree</i>

traverses  
<i>Returns the number of traverses required to reach a node using eon.FindNode (breadth first)</i>
