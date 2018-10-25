/* TO DO
Change get all node paths to take an array of nodes 
Generate Node Tree
Generate route map?
*/

function NodeUtils(){ // NodeUtils Object
	//Get all nodes but the eon.Find way
	this.GetAllNodes = function(rootName){
		if(rootName == "" || rootName == undefined){
			rootName = eon.GetNodeName(eon.FindByProgID('EonD3D.Simulation.1').item(0));
		}
		var aNc = eon.Find(/.*/, eon.FindNode(rootName));
		//All nodes is a collection at this point
		//So push it into an array
		var aNa = [];
		for(var i = 0; i < aNc.Count; i++){
			aNa.push(aNc.item(i));
		}

		return aNa;
	};

	// Return the sim node, smae as GetAllNodees()[0]
	this.GetSim = function(){
		return eon.FindByProgID('EonD3D.Simulation.1').item(0);
	}

	//This function returns an array containing the names of all the nodes passed in (as an array)
	this.GetAllNodeNames = function(nodes){
		var nodeNames = [];
		for(var i = 0; i < nodes.length; i++){
			nodeNames.push(eon.GetNodeName(nodes[i]));
		}
		return nodeNames;
	};

	this.CollectionToArray = function(col){
		var arr = [];
		for(var i = 0; i < col.Count; i++){
			arr.push(col.item(i));
		}
		return arr;
	};

	// Returns and array containing all node paths starting from rootNode
	this.GetAllNodePaths = function(rootNode){
		var allNodePaths = [];
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

	// Compares 2 node objects, returns tru if they are the same, false otherwise
	this.compareNodes = function(n1,n2){
		if(eon.GetNodePath(n1) == eon.GetNodePath(n2)){
			return true;
		}
		return false;
	};

	// Swaps to nodes in the simulation tree
	this.swapNodes = function(n1, n2){
		//Field values should be maintained when copying, this is important when other nodes are refenced in the nodes being swapped

		eon.CopyNode(n1, n2.GetParentNode()); // copy n1 to parent of n2
		eon.CopyNode(n2, n1.GetParentNode()); // copy n2 to parent of n1
		//Delete originals
		eon.DeleteNode(n1);
		eon.DeleteNode(n2);
	};

	// Swaps the references of one field with the refences in another field
	// Expects two field objects
	// for now single field
	this.swapRefs = function(f1, f2){
		eon.Trace(f1.GetType());
		if(f1.GetType() != f2.GetType()){
			eon.MessageBox('Attempting to switch fields of different types!', 'NODE UTILS');
		}

		// If field.GetType() > 10 then must be multi field
		// Also assumes both fields are of the same length
		if(f1.GetType() > 10){
			var tempf1a = [];
			var tempf2a = [];
			for(var i = 0; i < f1.GetMFCount(); i++){
				tempf1a.push(f1.GetMFElement(i));
				tempf2a.push(f2.GetMFElement(i));
				f1.SetMFElement(i, tempf2a[i]);
				f2.SetMFElement(i, tempf1a[i]);
			}
		}else{
			var tempf1 = f1.value;
			var tempf2 = f2.value;
			f1.value = tempf2;
			f2.value = tempf1;
		}
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
	//This function works exaclty like copy node, but allows you to specify howmany copies you want to create
	this.MultCopy = function(node, toNode, numCopies){
		for(var i = 0; i < numCopies; i++){
			eon.CopyNode(node, toNode);
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

}

function calcDistance3D(a, b){
	// D = √((Ax - Bx)2 + (Ay - By)2 + (Az - Bz)2)
	return Math.sqrt(Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]), 2) + Math.pow((a[2]-b[2]), 2));
}

function midpoint3D(a, b){ 
	// M ( (Ax + Bx)/2 , (Ay + By)/2 , (Az + Bz)/2 )
	return [(a[0]+b[0])/2, ((a[1]+b[1])/2), ((a[2]+b[2])/2)];
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


