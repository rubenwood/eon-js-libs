function NodeUtils(){ // NodeUtils Object
	var allNodes = []; // This stores all nodes we get from GetAllNodes
	
	//This function returns an array of all nodes starting at rootNode
	this.GetAllNodes = function(rootNode){
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

	//This function returns the length of all the nodes from GetAllNodes
	this.GetNodeCount = function(){
		eon.Trace("How many nodes: " + allNodes.length);
		return allNodes.length;
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

	//This function will return the type of a node (without using ProgID)
	this.GetNodeType = function(aNode){
		var fieldCount = aNode.GetFieldCount(); 		// Get the number of fields this node has
		var fieldNames = this.GetAllFieldNames(aNode); 	// Get all names of fields for this node
		//Have to check field count and field names, that way we can determine what kind of node it is

	};

	//Sets SetRun of a node to true, can pass in a node or a string
	//NU.on(eon.FindNode("PlaceNode1")); or NU.on("PlaceNode1")
	this.on = function(aNode){
		if(typeof aNode == "string"){
			eon.FindNode(aNode).GetFieldByName('SetRun').value = true;
		}else{
			aNode.GetFieldByName('SetRun').value = true;
		}
	};
	//Turn all nodes in a list on
	this.allOn = function(nodeList){
		for(var i = 0; i < nodeList.length; i++){
			nodeList[i].GetFieldByName('SetRun').value = true;
		}
	}	
}
// Node Object
function node(){

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