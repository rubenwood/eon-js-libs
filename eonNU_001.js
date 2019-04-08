/* EONNU External Library for EON
Created by Ruben Wood, Last updated 01/02/2019
This external Library attempts to upgrade the EON API by provide many new functions

TODO:
Add to github repo

ProgID?
Timing Events?
Scene Constructor?
*/

/*** EON OBJECT SECTION ***/
var protoEON = Object.getPrototypeOf(eon);
var eon_proto = {};
Object.setPrototypeOf(protoEON, eon_proto);

// Returns the simulation node (regardless of name)
eon_proto.GetSim = function(){
	//eon_proto.method = "eon.GetSim";
	return eon.Find(/.*/).item(0);
};
// Returns the statistics data of the simulation (String Array)
eon_proto.GetSimData = function(){
	//eon_proto.method = "eon.GetSimData";
	return this.GetSim().GetFieldByName('StatisticData').value;
};
// Returns the current fps
eon_proto.fps = function(){
	eon.Trace(eon.GetSimData()[0]);
	return eon.GetSimData()[0];
};
// Get all nodes but the eon.Find way
eon_proto.GetAllNodes = function(rootName){
	//eon_proto.method = "eon.GetAllNodes";
	if(rootName == "" || rootName == undefined){
		rootName = eon.GetNodeName(eon_proto.GetSim());
	}
	var aNc = eon.Find(/.*/, eon.FindNode(rootName));
	//All nodes is a collection at this point
	//So push it into an array
	var aNa = eon_proto.CollectionToArray(aNc);

	return aNa;
};
// This function returns an array containing the names of all the nodes passed in (as an array)
eon_proto.GetAllNodeNames = function(nodes){
	//eon_proto.method = "eon.GetAllNodeNames";
	var nodeNames = [];
	for(var i = 0; i < nodes.length; i++){
		nodeNames.push(eon.GetNodeName(nodes[i]));
	}
	return nodeNames;
};
// This function turns an eon collection into an array
eon_proto.CollectionToArray = function(col){
	//eon_proto.method = "eon.CollectionToArray";
	var arr = [];
	for(var i = 0; i < col.Count; i++){
		arr.push(col.item(i));
	}
	return arr;
};
// Returns an array containing all node paths of an array of nodes
eon_proto.GetAllNodePaths = function(nodes){
	//eon_proto.method = "eon.GetAllNodPaths";
	var allNodePaths = [];
	for(var i = 0; i < nodes.length; i++){
		allNodePaths.push(eon.GetNodePath(nodes[i]));
	}
	return allNodePaths;
};

// Returns and array of all viewports (node array)
eon_proto.GetViewports = function(){
	//eon.Trace(eon.GetAllNodeNames(eon.GetSim().GetFieldByName('Viewports').value));
	return eon.GetSim().GetFieldByName('Viewports').value;
};

// Compares 2 node objects, returns tru if they are the same, false otherwise
eon_proto.compareNodes = function(n1,n2){
	//eon_proto.method = "eon.compareNodes";
	if(eon.GetNodePath(n1) == eon.GetNodePath(n2)){
		return true;
	}
	return false;
};
// Swaps to nodes in the simulation tree
eon_proto.swapNodes = function(n1, n2){
	//eon_proto.method = "eon.swapNodes";
	//Field values should be maintained when copying, this is important when other nodes are refenced in the nodes being swapped
	eon.CopyNode(n1, n2.GetParentNode()); // copy n1 to parent of n2
	eon.CopyNode(n2, n1.GetParentNode()); // copy n2 to parent of n1
	//Delete originals
	eon.DeleteNode(n1);
	eon.DeleteNode(n2);
};
// Swaps the references of one field with the refences in another field
// Expects two field objects
eon_proto.swapRefs = function(f1, f2){
	//eon_proto.swapRefs = "eon.swapRefs";
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
// This function enables or disables nodes depening on the value 'v', if true, it enables, if false it disables
// better to use regex?
eon_proto.EnableDisableNodes = function(nodes, v){
	//eon_proto.method = "eon.EnableDisableNodes";
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
// This function takes an array of nodes and disables them all
eon_proto.DisableNodes = function(nodes){
	//eon_proto.method = "eon.DisableNodes";
	eon_proto.EnableDisableNodes(nodes, false);
};
// This function takes an array of nodes and enables them all
eon_proto.EnableNodes = function(nodes){
	//eon_proto.method = "eon.EnableNodes";
	eon_proto.EnableDisableNodes(nodes, true);
};
// This function returns all the nodes that posses a certain field
eon_proto.GetNodesWithField = function(nodes, field){
	//eon_proto.method = "eon.GetNodesWithField";
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
// Return all nodes posessing specific fields (specify an array of nodes to search and an array of field names)
eon_proto.GetNodesWithFields = function(nodes, fields){
	//eon_proto.method = "eon.GetNodesWithFields";
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
// This function returns an array of all fields beloning to a node
eon_proto.GetAllFields = function(aNode){
	//eon_proto.method = "eon.GetAllFields";
	var fields = [];
	for(var i = 0; i < aNode.GetFieldCount(); i++){
		fields.push(aNode.GetField(i));
	}
	return fields;
};
// This function returns an array of all the field names beloning to a node
eon_proto.GetAllFieldNames = function(aNode){
	//eon_proto.method = "eon.GetAllFieldNames";
	var fieldNames = [];
	var fields = eon_proto.GetAllFields(aNode);
	for(var i = 0; i < fields.length; i++){
		fieldNames.push(fields[i].GetName());
	}
	return fieldNames;
};
// This function will copy a node to its parent
eon_proto.CopyToParent = function(node){
	//eon_proto.method = "eon.CopyToParent";
	eon.CopyNode(node, node.GetParentNode());
};
//This function works exaclty like copy node, but allows you to specify how many copies you want to create
eon_proto.MultCopy = function(node, toNode, numCopies){
	eon_proto.method = "eon.MultCopy";
	for(var i = 0; i < numCopies; i++){
		eon.CopyNode(node, toNode);
	}
};

/*********** WORK IN PROGRESS ************/
// This function will copy a node to all of the children of rootNode
eon_proto.CopyToAllChildren = function(node, rootNode){
	//eon_proto.method = "eon.CopyToAllChildren";
	var children = rootNode.GetFieldByName('TreeChildren');
	for(var i = 0; i < children.GetMFCount(); i++){
		eon.Trace(eon.GetNodeName(children.GetMFElement(i)));
		eon.CopyNode(node, children.GetMFElement(i));
	}
};

// This function checks if a node has a rigidbody child
eon_proto.hasRB = function(node){
	//eon_proto.method = "eon.hasRB";
	for(var i = 0; i < node.GetFieldByName('TreeChildren').GetMFCount(); i++){
		if(eon.GetNodeProgID(node.GetFieldByName('TreeChildren').GetMFElement(i)) == 'PhysXNodes.RigidBody.1'){
			return true;
		}else{
			return false;
		}
	}
};
// This function returns the first rigidbody of a node
eon_proto.getFirstRBOfNode = function(rootNode){
	//eon_proto.method = "eon.getFirstRBOfNode";
	var rb = eon.FindByProgID('PhysXNodes.RigidBody.1', rootNode);
	return rb.item(0); //return first rigidbody within rootNode
};
// Returns the number of levels deep a node is in the simulation tree
var i = 1;
eon_proto.depth = function(aNode){
	//eon_proto.method = "eon.depth";
	var origNode = aNode;
	
	while(eon.GetNodeName(aNode.GetParentNode()) != 'Simulation'){
		aNode = aNode.GetParentNode();
		i++;
		this.depth(aNode);
	}
	return i;
};

// !! WIP !! //
// This function will return the type of a node (without using ProgID) WORK IN PROGRESS
eon_proto.GetNodeType = function(aNode){
	var fieldCount = aNode.GetFieldCount();
	//Have to check field count and field names that way we can determine what kind of node it is
};

/*** NODE OBJECT SECTION ***/
var protoNode = Object.getPrototypeOf(eon.GetSim());
var node_proto = {};
Object.setPrototypeOf(protoNode, node_proto);

/*** FIELD OBJECT SECTION ***/
var protoField = Object.getPrototypeOf(eon.GetSim().GetField(0));
var field_proto = {};
Object.setPrototypeOf(protoField, field_proto);

// Randomize values in SFVec3, between 0 and 1
field_proto.randV3 = function(){
	if(this.GetType() != 10){
		return;
	}

	this.value = [Math.random(),Math.random(),Math.random()];
};
// Randomize values in SFVec2, between 0 and 1
field_proto.randV2 = function(){
	if(this.GetType() != 9){
		return;
	}

	this.value = [Math.random(),Math.random()];
};
// Randomize float value, betwen 0 and 1
field_proto.randFloat = function(){
	if(this.GetType() != 2){
		return;
	}

	this.value = Math.random();
};
// Returns the dataype of the field as a string value
field_proto.GetTypeStr = function(){
	var dataTypes = ['SFBool',
    'SFColor',
    'SFFloat',
    'SFImage',
    'SFInt32',
    'SFNode',
    'SFRotation',
    'SFString',
    'SFTime',
    'SFVec2f',
    'SFVec3f',
    'MFBool',
    'MFColor',
    'MFFloat',
    'MFImage',
    'MFInt32',
    'MFNode',
    'MFRotation',
    'MFString',
    'MFTime',
    'MFVec2f',
    'MFVec3f',
    'SFVec4f',
    'MFVec4f'];

    return dataTypes[this.GetType()];
};

/*
const DATA_TYPE = {
    'SFBool':      0,
    'SFColor':     1,
    'SFFloat':     2,
    'SFImage':     3,
    'SFInt32':     4,
    'SFNode':      5,
    'SFRotation':  6,
    'SFString':    7,
    'SFTime':      8,
    'SFVec2f':     9,
    'SFVec3f':    10,
    'MFBool':     11,
    'MFColor':    12,
    'MFFloat':    13,
    'MFImage':    14,
    'MFInt32':    15,
    'MFNode':     16,
    'MFRotation': 17,
    'MFString':   18,
    'MFTime':     19,
    'MFVec2f':    20,
    'MFVec3f':    21,
    'SFVec4f':    22,
    'MFVec4f':    23
}
*/

//*** OTHER ***/
function calcDistance3D(a, b){
	// D = √((Ax - Bx)2 + (Ay - By)2 + (Az - Bz)2)
	return Math.sqrt(Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]), 2) + Math.pow((a[2]-b[2]), 2));
}

function midpoint3D(a, b){ 
	// M ( (Ax + Bx)/2 , (Ay + By)/2 , (Az + Bz)/2 )
	return [(a[0]+b[0])/2, ((a[1]+b[1])/2), ((a[2]+b[2])/2)];
}


/***** PROG ID *****/
// EonD3D2
ProgID_Frame                       = "EonD3D.Frame.1"
ProgID_Light                       = "EonD3D.Light.2"
ProgID_Simulation                  = "EonD3D.Simulation.1"
ProgID_Viewport                    = "EonD3D.Viewport2.1"
ProgID_Group                       = "EONAgentpack2.Group.1"
ProgID_ObliqueNearPlaneExtension   = "EonD3D.ObliqueNearPlaneExtension.1"
ProgID_PlaneReflectionExtension    = "EonD3D.PlaneReflectionExtension.1"

// EONVisualNodes
ProgID_ShapeNode                  = "EONVisualNodes.Shape.1"
ProgID_Box                        = "EONVisualNodes.Box.1"
ProgID_Sphere                     = "EONVisualNodes.Sphere.1"
ProgID_Mesh2                      = "EONVisualNodes.Mesh2.1"
ProgID_MeshBuilder                = "EONVisualNodes.MeshBuilder.1"
ProgID_MeshResourceGroup          = "EONVisualNodes.MeshResourceGroup.1"
ProgID_Material2                  = "EONVisualNodes.Material2.1"
ProgID_Material3                  = "EONVisualNodes.Material3.1"
ProgID_LeatherMaterial            = "EONVisualNodes.LeatherMaterial.1"
ProgID_HDRMaterial                = "EONVisualNodes.HDRMaterial.1"
ProgID_MultiMaterial              = "EONVisualNodes.MultiMaterial.1"
ProgID_HatchMaterial              = "EONVisualNodes.HatchMaterial.1"
ProgID_MultiLayerMaterial         = "EONVisualNodes.MultiLayerMaterial.1"
ProgID_MetalFlakesMaterial        = "EONVisualNodes.MetalFlakesMaterial.1"
ProgID_UltraHDRMaterial           = "EONVisualNodes.UltraHDRMaterial.1"
ProgID_CgMaterial                 = "EONVisualNodes.CgMaterial.1"
ProgID_CgFXMaterial               = "EONVisualNodes.CgFXMaterial.1"
ProgID_Texture2                   = "EONVisualNodes.Texture2.1"
ProgID_RenderTexture              = "EONVisualNodes.RenderTexture.1"
ProgID_TextureCoordinateGenerator = "EONVisualNodes.TextureCoordinateGenerator.1"
ProgID_TextureResourceGroup       = "EONVisualNodes.TextureResourceGroup.1"

// AgentPack1
ProgID_AgentDirectSound = "EonAgentPack1.AgentDirectSound.1"
ProgID_KeyFrame         = "EonAgentPack1.KeyFrame.1"
ProgID_AgentRotate      = "EonAgentPack1.AgentRotate.1"
ProgID_TimeSensor       = "EonAgentPack1.TimeSensor.1"
ProgID_ToolTip          = "EonAgentPack1.ToolTip.1"
ProgID_DOF              = "EonAgentPack2.DOF.1"
ProgID_MouseSensor      = "EonAgentPack2.MouseSensor.1"
ProgID_Panorama         = "PanoramaAgents.Panorama.1"
ProgID_WalkAbout        = "EonAgentPack2.WalkAbout.1"
ProgID_TextBox          = "EonAgentPack2.TextBox.1"

// DynamicPrototype
ProgID_EonDynamicPrototypeInstance = "EonKernel.EonDynamicPrototypeInstance.1"

// EonAgentPack2
ProgID_Billboard            = "EonAgentPack2.Billboard.1"
ProgID_AgentBoxSensor       = "EonAgentPack1.AgentBoxSensor.1"
ProgID_EonPrototypeInstance = "EonD3D.EonPrototypeInstance.1"
ProgID_AgentKeyMove         = "EonAgentPack1.AgentKeyMove.1"
ProgID_Motion               = "EonAgentPack1.Motion.1"
ProgID_Sequence             = "EonKernel.Sequence.1"
ProgID_Switch               = "EonKernel.Switch.1"
ProgID_LevelOfDetail        = "EonKernel.LevelOfDetail.1"
ProgID_MeshExplosion        = "MeshExpl.MeshExplosion.1"
ProgID_OceanWaves           = "WaveGen.OceanWaves.1"

// EON Movie
ProgID_MovieTexture = "Agent.MovieTexture.1"

//  Script
ProgID_ScriptNode  = "ScriptNode.ScriptNode.1"

//  SceneModifier
ProgID_SceneModifier = "EONSceneModifier.SceneModifier.1"

//  EonAgentPack1
ProgID_AgentWalk        = "EonAgentPack1.AgentWalk.1"
ProgID_Latch2           = "EonNodePack1.Latch2.1"
ProgID_KeyboardSensor   = "EonAgentPack2.KeyboardSensor.1"
ProgID_ClickSensor      = "EonAgentPack1.ClickSensor.1"
ProgID_Place            = "EonAgentPack1.Place.1"
ProgID_Proximity        = "EonAgentPack1.Proximity.1"
ProgID_ChangeSimulation = "EonAgentPack2.ChangeSimulation.1"
ProgID_ISector          = "EonAgentPack2.ISector.1"
ProgID_License          = "EONLicense.License.1"