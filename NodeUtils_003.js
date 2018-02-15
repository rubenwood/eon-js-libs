function NodeUtils(){ 		// NodeUtils Object
	var allNodes = []; 		// This stores all nodes we get from GetAllNodes
	var allNodePaths = []; 	// This stores all node paths
	
	//This function returns an array of all nodes starting at rootNode
	this.GetAllNodes = function(rootNode){ // Watch out for Maximum call stack!!
		if(rootNode == "" || rootNode == undefined){
			rootNode = "Simulation";
		}

		var children = eon.FindNode(rootNode).GetFieldByName('TreeChildren'); //Finds first node and gets its children

		for(var i = 0; i < children.GetMFCount(); i++){
			allNodes.push(children.GetMFElement(i)); // push this node into array
			if(children.GetMFElement(i).GetFieldByName('TreeChildren').GetMFCount() != 0){
				this.GetAllNodes(eon.GetNodeName(children.GetMFElement(i))); // next child becomes rootNode
			}
		}

		return allNodes;
	};

	//This function returns an array containing the names of all the nodes passed in (as an array)
	this.GetAllNodeNames = function(nodes){
		var nodeNames = [];
		for(var i = 0; i < nodes.length; i++){
			nodeNames.push(eon.GetNodeName(nodes[i]));
		}
		return nodeNames;
	};

	//This function returns the length of all the nodes from a list of 
	// this.GetNodeCount = function(nodes){
	// 	eon.Trace("How many nodes: " + allNodes.length);
	// 	if(nodes != null){
	// 		return nodes.length;
	// 	}
	// 	return allNodes.length;
	// };

	//Returns and array containing all node paths starting from rootNode
	this.GetAllNodePaths = function(rootNode){
		if(typeof rootNode == 'undefined' || rootNode == ''){
			rootNode = eon.FindNode('Simulation');
		}

		//Get the children of rootNode
		var children = rootNode.GetFieldByName('TreeChildren').value;
		//loop through all of its children
		for(var i = 0; i < children.length; i++){
			//Only add to allNodes if this childs nodepath does not already occur in global allNodesPath array
			if(allNodePaths.indexOf(eon.GetNodePath(children[i])) == -1){
				//push each child node path into the allNodePaths array
				allNodePaths.push(eon.GetNodePath(children[i]));
			}
			//if this child has more than 0 children, then that child becomes the rootNode of the next search
			if(children[i].GetFieldByName('TreeChildren').value.length != 0){
				this.GetAllNodePaths(children[i]);
			}
		}

		return allNodePaths;
	};

	//This function enables or disables nodes depening on the value 'v', if true, it enables, if false it disables
	//better to use regex?
	this.EnableDisableNodes = function(nodes, v){
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].GetIdOfName('Enabled') != -1){
				nodes[i].GetFieldByName('Enabled').value = v;
			}
			if(nodes[i].GetIdOfName('enabled') != -1){
				nodes[i].GetFieldByName('enabled').value = v;
			}
			if(nodes[i].GetIdOfName('Enable') != -1){
				nodes[i].GetFieldByName('Enable').value = v;
			}
			if(nodes[i].GetIdOfName('Active') != -1){
				nodes[i].GetFieldByName('Active').value = v;
			}
			if(nodes[i].GetIdOfName('active') != -1){
				nodes[i].GetFieldByName('active').value = v;
			}
			nodes[i].GetFieldByName('SetRun').value = v;
			nodes[i].GetFieldByName('SetRun_').value = !v;
		}
	};
	//This function takes an array of nodes and disables them all
	this.DisableNodes = function(nodes){
		this.EnableDisableNodes(nodes, false);
	};
	//This function takes an array of nodes and enables them all
	this.EnableNodes = function(nodes){
		this.EnableDisableNodes(nodes, true);
	};

	//This function returns all the nodes that posses a certain field
	this.GetNodesWithField = function(nodes, field){
		var nodesWithField = [];
		for(var i = 0; i < nodes.length; i++){ // for every node in list
			for(var j = 0; j < nodes[i].GetFieldCount(); j++){ // for each field this node contains
				if(nodes[i].GetField(j).GetName() == field){
					//eon.Trace(eon.GetNodeName(nodes[i]) + " has a " + field + " field, and its value is: " + nodes[i].GetFieldByName(field).value);
					nodesWithField.push(nodes[i]);
				}
			}
		}
		return nodesWithField;
	};

	//This function returns an array of all fields beloning to a node
	this.GetAllFields = function(aNode){
		var fields = [];
		for(var i = 0; i < aNode.GetFieldCount(); i++){
			fields.push(aNode.GetField(i));
		}
		return fields;
	};

	//This function returns an array of all the field names beloning to a node
	this.GetAllFieldNames = function(aNode){
		var fieldNames = [];
		var fields = this.GetAllFields(aNode);
		for(var i = 0; i < fields.length; i++){
			fieldNames.push(fields[i].GetName());
		}
		return fieldNames;
	};

	/***********WORK IN PROGRESS************/
	//This funciton will copy a node to its parent
	this.CopyToParent = function(node){
		eon.CopyNode(node, node.GetParentNode());
	};
	//This funciton will copy node to the first child of node, Not needed?
	this.CopyToChild = function(node){

	};
	//This function will copy a node to all of the children of rootNode
	this.CopyToAllChildren = function(node, rootNode){
		var children = rootNode.GetFieldByName('TreeChildren');
		for(var i = 0; i < children.GetMFCount(); i++){
			eon.Trace(eon.GetNodeName(children.GetMFElement(i)));
			eon.CopyNode(node, children.GetMFElement(i));
		}
	};

	//This function checks if a node has a rigidbody child
	this.hasRB = function(node){
		for(var i = 0; i < node.GetFieldByName('TreeChildren').GetMFCount(); i++){
			if(eon.GetNodeProgID(node.GetFieldByName('TreeChildren').GetMFElement(i)) == 'PhysXNodes.RigidBody.1'){
				return true;
			}else{
				return false;
			}
		}
	};
	//This function returns the first rigidbody of a node
	this.getFirstRBOfNode = function(rootNode){
		var rb = eon.FindByProgID('PhysXNodes.RigidBody.1', rootNode);
		return rb.item(0); //return first rigidbody within rootNode
	};


	//This function will return the type of a node (without using ProgID) WORK IN PROGRESS
	this.GetNodeType = function(aNode){
		var fieldCount = aNode.GetFieldCount();
		//Have to check field count and field names that way we can determine what kind of node it is
	};

	// Return all nodes posessing specific fields (specify an array of nodes to search and an array of field names)
	this.GetNodesWithFields = function(nodes, fields){
		//We want to check each node (nodes[i]) and see if it posseses ALL fields
		//Does node[i] have all these fields?
		var nodesWithFields = [];
		var fc = 0;
		for(var i = 0; i < nodes.length; i++){
			for(var j = 0; j < fields.length; j++){
				if(nodes[i].GetIdOfName(fields[j]) == -1){
					fc = 0;
					break;
				}else{
					fc += 1;
				}
			}
			if(fc == fields.length){
				nodesWithFields.push(nodes[i]);
			}
		}
		return nodesWithFields;
	};

	//This function will return the type of a node (without using ProgID)
	this.GetNodeType = function(aNode){
		var fieldCount = aNode.GetFieldCount(); 		// Get the number of fields this node has
		var fieldNames = this.GetAllFieldNames(aNode); 	// Get all names of fields for this node
		//Have to check field count and field names, that way we can determine what kind of node it is

	};

	//Generate route map?
}

/*
Nodes
	Name
	ProgID
	Node Category
	Node Type
	Number of Fields
	Fields
		Name
		Field Type (EventIn, EventOut, ExposedField)
		Data Type (SFBool, SFInt32, SFFloat, SFVec3f, SFVec3f, MF-)
*/

/***OTHER STUFF***/
// Returns the number of levels deep a node is in the simulation tree
var i = 1;
function depth(aNode){
	var origNode = aNode;
	
	while(eon.GetNodeName(aNode.GetParentNode()) != 'Simulation'){
		aNode = aNode.GetParentNode();
		i++;
		depth(aNode);
	}
	return i;
}

// WORK IN PROGRESS, needs to be improved
// Returns the number of traverses required to reach this node using FindNode (breadth first)
var tNodes = [];
var temp = [];
var x = 0;
function traverses(aNode, rootNode){
	if(typeof rootNode == 'undefined' || rootNode == ''){
		rootNode = eon.FindNode('Simulation');
	}

	var children = rootNode.GetFieldByName('TreeChildren').value;

	if(tNodes.indexOf(aNode) == -1){
		for(var i = 0; i < children.length; i++){
			//Push each child into tNodes
			tNodes.push(children[i]);
			//Then first of tNodes will become root of next search
			temp.push(children[i]);
		}
		if(x == 0){
			x++; //if x is zero then dont slice the head off the array, just use 0
			traverses(aNode, temp[0]);
		}else{
			//if x is greater than 0 (if we have recursed more than once), then
			temp = temp.slice(1); // slice the head off the temp array
			traverses(aNode, temp[0]);
		}
	}

	// tNodes is nodes sorted into breadth first
	// tNodes.indexOf(aNode) will be how many nodes need to be traversed to reach that node

	eon.Trace('There were ' + tNodes.indexOf(aNode) + ' traverses to reach this node');
	return tNodes;
}
