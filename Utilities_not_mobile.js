/*-------------------------------------------------------->

 Description:
	General utility functions.

 Includes:
	Include/Utilities.js 

 Fields:

*/

//-------------------------------------------------------->
// Constants
//
// Some common node prog IDs ( node type IDs). 
// Node prog  IDs can be determoned with the function eon.GetNodeProgID(node);
//  These are not all the node prog IDs that exist,  it's just souple of common ones, fill in as needed.
// Updated 2008-06-28, EON 6.1.x.x

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

//-------------------------------------------------------->
// Functions
//
// Try to get a node from a SFNode field, return null
// if the field is empty
function GetSFNode(field){
	var node = null;
	try
	{
		node = field.value;
	}
	catch(exception)
	{
		node = null;
	}
	return node;
}

// Set node node in a SFNode field
// The main reason to use this one is that it makes it  possible to set a SFNode field to null
function SetSFNode(field, node){
	if (!field)
	{
		Trace("Error: SetSFNode: field is null")
		return;
	}
	
	if (!node)
		field.SetStringValue("");
	else
	{
//		Trace("SetSFNode node: " + eon.GetNodepath(node))
		field.value = node;
	}
}

// Remove all elements in a MF field
function clearMFField(field){
	while (field.GetMFCount()>0)
	{
		field.RemoveMFElement(0);
	}
}


// Get an SFVec3f as a string in the format (x,y,z).
// The decimal part is rounded to the specified number of digits.
function SFVec3fToString(field, nofDecimals){
	if (arguments.length == 1)
		nofDecimals = 2;
	var v = field.Value.toArray();
	return "(" + Round(v[0], nofDecimals) + "," + Round(v[1], nofDecimals) + "," + Round(v[2], nofDecimals) + ")";
}


// Get an array of nodes from a MFNode field
function MFNodeToArray(field){
	var a = new Array();
	for (var i = 0; i < field.GetMFCount(); i++)
		a.push(field.GetMFElement(i));
	return a;
}

function NodeCollectionToArray(nodeCollection){
	var a = new Array();
	for (var i = 0; i < nodeCollection.Count; i++)
		a.push(nodeCollection.item(i));
	return a;
}


// Get an SFFloat as a string.
// The decimal part is rounded to the specified number of digits.
function SFFloatToString(field, nofDecimals){
	if (arguments.length == 1)
		nofDecimals = 2;
	return Round(field.Value, nofDecimals).toString();
}


// Round the value to the specified number of digits.
function Round(value, nofDecimals){
	if (arguments.length == 1)
		nofDecimals = 2;
	var x = Math.pow(10, nofDecimals);
	return Math.round(value * x) / x;
}


// Try to get the specified field from a node.
// Return null if it does not exist.
function GetField(node, fieldName){
	var field = null;
	try
	{
		field = node.GetFieldByName(fieldName);
	}
	catch(exception)
	{
		field = null;
	}
	return field;
}


// Trace with prepended script node path
function Trace(desc, msg){
	if (!msg)
	{
		msg = desc;
		desc = eon.GetNodeName(eonthis);
	}
	eon.Trace2(eon.getnodepath(eonthis), desc, msg);
}


function GetParent(){
	return eonthis.GetParentNode();
}

function GetParentFrame(node){
	var parent = node.GetParentNode();
	while (parent && eon.GetNodeProgID(parent) != ProgID_Frame)
		parent = parent.GetParentNode();
	return parent;
}

// Find the viewport matching the camera
function FindMatchingViewPort(camera){
	var simNode = GetSimulationNode();
	if (!simNode)
	{
		Trace("Could Not find the simulation node");
		return;
	}
	
	// loop through viewports
	var count = simNode.GetFieldByName("Viewports").GetMFCount();
	for (var i = 0; i < count; i++)
	{
		var viewport = simNode.GetFieldByName("Viewports").GetMFElement(i);
		if (viewport)
		{
			var vpcamera = GetSFNode(viewport.GetFieldByName("Camera"))
			if (vpcamera == camera)
				return viewport;
		}
	}
	return null;
}

// Find a node in a MFNode field
function FindMFNode(field, node){
	// loop through nodes
	var count = field.GetMFCount();
	for (var i = 0; i < count; i++)
	{
		var node_ = field.GetMFElement(i);
		if (node_ == node)
			return i;
	}
	return -1;
}

function FindFirst1(nodeName){
	var nodes = eon.Find(nodeName);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}


function FindFirst2(nodeName, rootNode){
	var nodes = eon.Find(nodeName, rootNode);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function FindFirst3(nodeName, rootNode, maxDepth){
	var nodes = eon.Find(nodeName, rootNode, maxDepth);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function FindFirstByProgID1(progID){
	var nodes = eon.FindByProgID(progID);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function FindFirstByProgID2(progID, rootNode){
	var nodes = eon.FindByProgID(progID, rootNode);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function FindFirstByProgID3(progID, rootNode, maxDepth){
	var nodes = eon.FindByProgID(progID, rootNode, maxDepth);
	if (nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function IsNodeReference(node, parent){
	return !IsNodeInstance(node, parent)
}

function IsNodeInstance(node, parent){
//	Trace("IsNodeInstance: node: " + eon.GetNodePath(node))
//	Trace("IsNodeInstance: parent: " + eon.GetNodePath(parent))
	var treeChildren = parent.GetFieldByName("TreeChildren")
	for ( var i=0; i<treeChildren.GetMFCount(); i++ )
	{
    	if ( node == treeChildren.GetMFElement(i) )
			return true;
	}
	return false;
}

// Get the field where a node instance  is.
// Return the field for the first node found but not the TreeChildren field
function GetParentNodeField(node){
	var parent = node.GetParentNode()

//	Trace("Node" + eon.GetNodepath(node))
//	Trace("Parent" + eon.GetNodepath(parent))

	// Loop over fields
	for ( var i=0; i<parent.GetFieldCount(); i++ )
	{
		// Check fields
		var field = parent.GetField(i)
//		Trace("Checking field: " + field.GetName() + ", type: " + field.GetType())
		
		// Skip  TreeChildren,  generally we dont want that field
		if (field.GetName() == "TreeChildren")
			continue;
			
		if ( field.GetType() == 5 )
		{
			if (GetSFNode(field) == node)
				return field;
		}
		else if ( field.GetType() == 16 )
		{
			if (FindMFNode(field, node) != -1)
				return field;
		}
	}
	Trace("GetParentNodeField: Error: " + eon.GetNodepath(node) + " not found in any of the fields in " + eon.GetNodepath(parent))
	return null
}

// A more generic versoin of MoveNodeToNewParent
// MoveNodeToNewParent can actually call this one when we know this one works
function MoveNode(node, targetParent, targetField){
	if (!node)
		throw "MoveNode: node is null"
	if (!targetParent)
		throw "MoveNode: targetParent is null"
	if (!targetField)
		throw "MoveNode: targetField is null"
	
	var sourceParent = node.GetParentNode()
	var sourceField = GetParentNodeField(node)
	if (sourceParent == targetParent)
		return;

	// Do the actual move 
	{
		// Add references in targetParent
		GetField(targetParent, "TreeChildren").AddMFElement(node)
		if ( targetField.GetType() == 5 )
			targetField.Value = node;
		else if (targetField.GetType() == 16)
			targetField.AddMFElement(node)
		else
			Trace("MoveNode: Error: Target field type is not SFNode or MFNode, cannot move the node")

		// Remove references in sourceParent
		var sourceTreeChildrenIndex = FindMFNode(sourceParent.GetFieldByName("TreeChildren"), node);
		GetField(sourceParent, "TreeChildren").RemoveMFElement(sourceTreeChildrenIndex)
		if ( sourceField.GetType() == 5 )
		{
			SetSFNode(sourceField, null);
		}
		else if (sourceField.GetType() == 16)
			sourceField.RemoveMFElement(FindMFNode(sourceField, node))
		else
			Trace("MoveNode: Error: Target field type is not SFNode or MFNode, cannot move the node")
	}
}

// move a node to a new location in the scenegraph
function MoveNodeToNewParent(node, newparent){
	MoveNode(node, newparent, GetField(newparent, "Children"))
}

function GetSimulationNode(){
	var nodes = eon.FindByProgID(ProgID_Simulation);
	if ( nodes.Count>0)
		return nodes.item(0)
	else
		return null;
}

function GetSceneNode(){
	return GetSimulationNode().GetFieldByName("TreeChildren").GetMFElement(0);
}

function GetViewport(index){
	var simNode = GetSimulationNode();
	if (simNode.GetFieldByName("Viewports").GetMFCount() > index)
		return simNode.GetFieldByName("Viewports").GetMFElement(index);
	else
		return null;
}

function GetViewportCamera(index){
	var viewport = GetViewport(index)
	if (viewport)
		return GetSFNode(viewport.GetFieldByName("Camera"))
	else
		return null;
}


// Get a reference to the node in the field or if 
// it is empty get the prototype parent.
function GetNodeReferenceOrPrototypeParent(nodeReference){
	var node;
	if (GetSFNode(nodeReference))
		node = GetSFNode(nodeReference);
	else
		node = eonthis.GetParentNode().GetParentNode().GetParentNode();
	return node;		
}

function GetSFVec3f(field){
	return field.Value.toArray();
}

function SetSFVec3f(field, value0, value1, value2){
	if (arguments.length == 2)
		field.Value = eon.MakeSFVec3f(value0[0], value0[1], value0[2]);
	else
		field.Value = eon.MakeSFVec3f(value0, value1, value2);
}

function TraceVector3(msg, v){
	Trace(msg + " (" + v[0] + "," + v[1] + "," + v[2] + ")");
}

function findMainViewport(){
	// Find the first one that does not have the Target field set.
	// loop through viewports
	var simNode = GetSimulationNode();
	var count = simNode.GetFieldByName("Viewports").GetMFCount();
	for (var i = 0; i < count; i++)
	{
		var viewport = simNode.GetFieldByName("Viewports").GetMFElement(i);
		if (viewport)
		{
			if (viewport.GetFieldByName("Pickable").Value)
				return viewport;
		}
	}
	return null;
}
