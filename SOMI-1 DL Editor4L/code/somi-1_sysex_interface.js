/**
 * Description: Handles all user inputs of Max for Live device to create and parse SysEx messages
 * Author: Henrik Langer
 * Year: 2022
 * Company: Instruments of Things GmbH (c)
 * 
 * Mod: Edoardo Staffa
 * Mod Company: Diacronie Lab (c)
 * 
 * Notes:
 * - check with sensor if changing Id refreshes UI
 */

inlets = 31; 
outlets = 3; // SysEx out, Bang (when UI elements were updated), dictionary out

// SysEx manufacturer ID (Instruments of Things)
var SYSEX_MANF_ID = [
	0x00,
	0x21,
	0x72,
];

var SYSEX_DEV_IDS = [
	"IO-LIGHTS",
	"SOMI-1",
];

var SYSEX_CMD_START_IDX = 10;

// SysEx commands
var SYSEX_CMDS = [
    "SYSEX_CMD_UNKNOWN",
    "SYSEX_CMD_CC_SOLO",
    "SYSEX_CMD_CC_UNSOLO",
    "SYSEX_CMD_NOTE_CFG",
    "SYSEX_CMD_CC_CFG",
    "SYSEX_CMD_PB_CFG",
    "SYSEX_CMD_PERSIST",
    "SYSEX_CMD_MAPPINGS_RESET",
    "SYSEX_CMD_DISCOVER",
    "SYSEX_CMD_SENSOR_CFG",
    "SYSEX_CMD_SENSORS_RESET",
    "SYSEX_CMD_DISABLE_SLOTS",
    "SYSEX_CMD_BATTERY_LEVEL",
    "SYSEX_CMD_SENSOR_STATE",
    "SYSEX_CMD_UPDATE_SAMD",
];

// Getter / Setter flags
var SYSEX_GET_SET_FLAGS = [
	"GET",
	"SET",
];

// Movement parameters
var MOVEMENT_PARAMS = [
	"Tilt X",
	"Tilt Y",
	"Tilt Z",
	"Acceleration X",
	"Acceleration Y",
	"Acceleration Z",
	"Activity",
];

// Global variables
gSensorId = 0;
gCcParam = 0;
gCcEnable = true;
gCcInverse = false;
gCcScale = 1.0;
gCcSlewRise = 0.0;
gCcSlewFall = 0.0;
gCcSlewShape = 0.5;
gCcMidiChannel = 0;
gCcController = 16;
gCcHighRes = false;
gCcSolo = false;
gNoteParamGate = 6;
gNoteEnable = true;
gNoteGateInverse = false;
gNoteThreshold = 0.5;
gNoteParamPitch = 2;
gNoteMin = 36;
gNoteMax = 60;
gNotePitchInverse = false;
gNoteMidiChannel = 0;
gPbParam = 3;
gPbEnable = false;
gPbInverse = false;
gPbScale = 1.0;
gPbMidiChannel = 0;

gDiscoveryTask = 0;


// Pointing to embedded dictionary for UI variables refreshing and recalling
var snsr = new Dict("snsrSettings");

// Is used as workaround to address parameterlistener problem when routing back received midi
function msg_int(v)
{
	var data = {};
	data.value = v;

	//post('received int ' + v + '\n');

	if (inlet == 0){       // Sensor ID
		sensorSelectCb(data);
	}
	else if (inlet == 1){  // CC Param
		ccParamCb(data);
	}
	else if (inlet == 2){  // CC Enable
		ccEnableCb(data);	
	}
	else if (inlet == 3){  // CC Inverse
		ccInverseCb(data);
	}
	else if (inlet == 4){  // CC scale
		post('received int value in inlet 4!');
	}
	else if (inlet == 5){  // Slew Rise
		post('received int value in inlet 5!');
	}
	else if (inlet == 6){  // Slew Fall
		post('received int value in inlet 6!');
	}
	else if (inlet == 7){  // Slew Shape
		post('received int value in inlet 7!');
	} 
	else if (inlet == 8){  // CC Channel
		ccMidiChannelCb(data);
	}
	else if (inlet == 9){  // CC Controller
		ccControllerCb(data);
	}
	else if (inlet == 10){ // CC High Res
		ccHighResCb(data);
	}
	else if (inlet == 11){ // CC Solo
		ccSoloCb(data);
	}
	else if (inlet == 12){ // Note Param Gate
		noteParamGateCb(data);
	}
	else if (inlet == 13){ // Note Enable
		noteEnableCb(data);
	}
	else if (inlet == 14){ // Note Gate Inverse
		noteGateInverseCb(data);
	}
	else if (inlet == 15){ // Note Threshold
		post('received int value in inlet 15!');
	}
	else if (inlet == 16){ // Note Param Pitch
		noteParamPitchCb(data);
	}
	else if (inlet == 17){ // Note Min
		noteMinCb(data);
	}
	else if (inlet == 18){ // Note Max
		noteMaxCb(data);
	}
	else if (inlet == 19){ // Note Pitch Inverse
		notePitchInverseCb(data);
	}
	else if (inlet == 20){ // Note Channel
		noteMidiChannelCb(data);
	}
	else if (inlet == 21){ // PB Param
		pbParamCb(data);
	}
	else if (inlet == 22){ // PB Enable
		pbEnableCb(data);
	}
	else if (inlet == 23){ // PB Inverse
		pbInverseCb(data);
	}
	else if (inlet == 24){ // PB Scale
		post('received int value in inlet 24!');
	}
	else if (inlet == 25){ // PB Channel
		pbMidiChannelCb(data);
	}
	else if (inlet == 26){ // Reset Mappings
		post('received int value in inlet 26!');
	}
	else if (inlet == 27){ // Reset Sensors
		post('received int value in inlet 27!');
	}
	else if (inlet == 28){ // Apply
		post('received int value in inlet 28!');
	}
	else if (inlet == 29){ // Save
		post('received int value in inlet 29!');
	}
	else if (inlet == 30){ // SAMD Update
		post('received int value in inlet 30!');
	}
}

function msg_float(v)
{
	var data = {};
	data.value = v;

	//post('received float ' + v + '\n');

	if (inlet == 0){       // Sensor ID
		post('received float value in inlet 0!');
	}
	else if (inlet == 1){  // CC Param
		post('received float value in inlet 1!');
	}
	else if (inlet == 2){  // CC Enable
		post('received float value in inlet 2!');
	}
	else if (inlet == 3){  // CC Inverse
		post('received float value in inlet 3!');
	}
	else if (inlet == 4){  // CC scale
		ccScaleCb(data);
	}
	else if (inlet == 5){  // Slew Rise
		ccSlewRiseCb(data);
	}
	else if (inlet == 6){  // Slew Fall
		ccSlewFallCb(data);
	}
	else if (inlet == 7){  // Slew Shape
		ccSlewShapeCb(data);
	}
	else if (inlet == 8){  // CC Channel
		post('received float value in inlet 8!');
	}
	else if (inlet == 9){  // CC Controller
		post('received float value in inlet 9!');
	}
	else if (inlet == 10){ // CC High Res
		post('received float value in inlet 10!');
	}
	else if (inlet == 11){ // CC Solo
		post('received float value in inlet 11!');
	}
	else if (inlet == 12){ // Note Param Gate
		post('received float value in inlet 12!');
	}
	else if (inlet == 13){ // Note Enable
		post('received float value in inlet 13!');
	}
	else if (inlet == 14){ // Note Gate Inverse
		post('received float value in inlet 14!');
	}
	else if (inlet == 15){ // Note Threshold
		noteThresholdCb(data);
	}
	else if (inlet == 16){ // Note Param Pitch
		post('received float value in inlet 16!');
	}
	else if (inlet == 17){ // Note Min
		post('received float value in inlet 17!');
	}
	else if (inlet == 18){ // Note Max
		post('received float value in inlet 18!');
	}
	else if (inlet == 19){ // Note Pitch Inverse
		post('received float value in inlet 19!');
	}
	else if (inlet == 20){ // Note Channel
		post('received float value in inlet 20!');
	}
	else if (inlet == 21){ // PB Param
		post('received float value in inlet 21!');
	}
	else if (inlet == 22){ // PB Enable
		post('received float value in inlet 22!');
	}
	else if (inlet == 23){ // PB Inverse
		post('received float value in inlet 23!');
	}
	else if (inlet == 24){ // PB Scale
		pbScaleCb(data);
	}
	else if (inlet == 25){ // PB Channel
		post('received float value in inlet 25!');
	}
	else if (inlet == 26){ // Reset Mappings
		post('received float value in inlet 26!');
	}
	else if (inlet == 27){ // Reset Sensors
		post('received float value in inlet 27!');
	}
	else if (inlet == 28){ // Apply
		post('received float value in inlet 28!');
	}
	else if (inlet == 29){ // Save
		post('received float value in inlet 29!');
	}
	else if (inlet == 30){ // SAMD Update
		post('received float value in inlet 30!');
	}
}

function bang(){

	var data = {};
	data.value = 1;

	if (inlet == 26){ // Reset Mappings
		rstMappingsCb(data);
		return;
	}
	else if (inlet == 27){ // Reset Sensors
		rstSensorsCb(data);
		return;
	}
	else if (inlet == 28){ // Apply
		applyCb(data);
		return;
	}
	else if (inlet == 29){ // Save
		saveCb(data);
		return;
	}
	else if (inlet == 30){ // SAMD Update
		updateSamdCb(data);
		return;
	}

/*
	// Run garbage collection to clear out any old object listeners
	// before registering new ones.
	gc();

	// Global parameter listeners
	new ParameterListener('somi1.sensor_select', sensorSelectCb);

	// Control Change parameter listeners
	new ParameterListener('somi1.cc_param', ccParamCb);
	new ParameterListener('somi1.cc_enable', ccEnableCb);
	new ParameterListener('somi1.cc_inverse', ccInverseCb);
	new ParameterListener('somi1.cc_scale', ccScaleCb);
	new ParameterListener('somi1.cc_slew_rise', ccSlewRiseCb);
	new ParameterListener('somi1.cc_slew_fall', ccSlewFallCb);
	new ParameterListener('somi1.cc_slew_shape', ccSlewShapeCb);
    new ParameterListener('somi1.cc_midi_channel', ccMidiChannelCb);
    new ParameterListener('somi1.cc_controller', ccControllerCb);
    new ParameterListener('somi1.cc_high_res', ccHighResCb);
    new ParameterListener('somi1.cc_solo', ccSoloCb);

    // Note parameter listeners
    new ParameterListener('somi1.note_param_gate', noteParamGateCb);
    new ParameterListener('somi1.note_enable', noteEnableCb);
    new ParameterListener('somi1.note_gate_inverse', noteGateInverseCb);
    new ParameterListener('somi1.note_threshold', noteThresholdCb);
    new ParameterListener('somi1.note_param_pitch', noteParamPitchCb);
    new ParameterListener('somi1.note_min', noteMinCb);
    new ParameterListener('somi1.note_max', noteMaxCb);
    new ParameterListener('somi1.note_pitch_inverse', notePitchInverseCb);
    new ParameterListener('somi1.note_midi_channel', noteMidiChannelCb);

    // Pitch Bend parameter listeners
    new ParameterListener('somi1.pb_param', pbParamCb);
    new ParameterListener('somi1.pb_enable', pbEnableCb);
    new ParameterListener('somi1.pb_inverse', pbInverseCb);
    new ParameterListener('somi1.pb_scale', pbScaleCb);
    new ParameterListener('somi1.pb_midi_channel', pbMidiChannelCb);

    // Settings control listeners
    new ParameterListener('somi1.rst_mappings', rstMappingsCb);
    new ParameterListener('somi1.rst_sensors', rstSensorsCb);
    new ParameterListener('somi1.apply', applyCb);
    new ParameterListener('somi1.save', saveCb);
    new ParameterListener('somi1.update_samd', updateSamdCb);

	post('Registered parameter listeners\n');
*/
	
    // Initialize battery level info texts
    for (var i=0; i < 6; i++){
        this.patcher.getnamed('bat' + (i+1)).message('set', '-'); // 0xE1FF5C
    }

    // Start timer for SOMI-1 discovery
    // TODO: Keep timer running and evaluate timeout via received SysEx response to check connection loss to SOMI-1 hub
    gDiscoveryTask = new Task(function(){
    	outlet(0, createSysExReqDiscovery());

    	post('Sent discovery request.\n');
    }, this);
    gDiscoveryTask.interval = 500; // Attention! Shouldn't be too low, otherwise more events received resulting in side effects
    gDiscoveryTask.repeat(-1);

    // Start timer to poll battery levels of sensors
    var sensorIdCnt = 0;
    var batteryLevelTask = new Task(function(){
    	outlet(0, createSysExReqBatteryLevel(sensorIdCnt));

    	sensorIdCnt = (sensorIdCnt + 1) % 6;
    }, this);
    batteryLevelTask.interval = 1000;
    batteryLevelTask.repeat(-1);

    // Initialize background colors of dynamic UI elements
    this.patcher.getnamed('somi1.found').message('bgcolor',       0.717647058823529, 0.717647058823529, 0.717647058823529, 1); // 0xE1FF5C
    this.patcher.getnamed('somi1.found').message('activebgcolor', 0.717647058823529, 0.717647058823529, 0.717647058823529, 1); // 0xE1FF5C

    // Used to renenable automations as parameters are changed via incoming SysEx message
    //startReenableAutomationObserver();

    /**
     * Tests
     */
    //outlet(0, createSysExCmdCcSolo(0, 16, false));
    //outlet(0, createSysExCmdNoteCfg(true, 0, 0, true, 0, 6, 2, 36, 60, 127, 0, 0.3, false, false));
    //outlet(0, createSysExCmdCcCfg(true, 0, 0, true, 0, 0, 16, false, 1.0, false, 0.5, 0.0, 0.0));
    //outlet(0, createSysExCmdPbCfg(true, 0, 0, true, 0, 3, 1.0, false));
    //outlet(0, createSysExCmdPersist());
    //outlet(0, createSysExCmdRstMappings());
    //outlet(0, createSysExCmdRstSensors());
    //outlet(0, createSysExCmdSlotsDisable());
    //outlet(0, createSysExReqBatteryLevel(0));
    //outlet(0, createSysExReqSensorState(0));
}

// Parses SysEx message
function list(){
	var len = arguments.length;
	var array = arguments;
	
	// Check SysEx headers
	if (array[0] 	 != 0xF0 ||  // Start
		array[1]  	 != 0x00 ||  // Manf ID 0
		array[2] 	 != 0x21 ||  // Manf ID 1
		array[3] 	 != 0x72 ||  // Manf ID 2
		array[4] 	 != 0x01 ||  // DEV ID (SOMI-1)
		array[len-1] != 0xF7) 	 // Stop
	{
		post('Received malformed SysEx message!\n');
		return;
	}

	const cmdId = array[SYSEX_CMD_START_IDX];

    post('Received SysEx command ' + SYSEX_CMDS[cmdId] + '\n');

	switch(SYSEX_CMDS[cmdId]){
		case "SYSEX_CMD_CC_SOLO":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_CC_UNSOLO":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_NOTE_CFG":{

			if (len != 29){
				post('Received malformed sysex note cfg! (len = '+ len +')\n');
				return;
			}

			gSensorId 	      = array[11];
			//var slotIdx 	  = array[12];
			gNoteEnable 	  = array[13];
			gNoteMidiChannel  = array[14];
			gNoteParamGate 	  = array[15];
			gNoteParamPitch   = array[16];
			gNoteMin          = array[17];
			gNoteMax          = array[18];
			//var velocityOn  = array[19];
			//var velocityOff = array[20];
			gNoteThreshold 	  = byteToFloat([array[21], array[22], array[23], array[24], array[25]]);
			gNoteGateInverse  = array[26];
			gNotePitchInverse = array[27];

            this.patcher.getnamed("somi1.note_enable").message("set", gNoteEnable);
            this.patcher.getnamed("somi1.note_midi_channel").message("set", gNoteMidiChannel+1);
            this.patcher.getnamed("somi1.note_param_gate").message("set", gNoteParamGate);
            this.patcher.getnamed("somi1.note_param_pitch").message("set", gNoteParamPitch);
            this.patcher.getnamed("somi1.note_min").message("set", 127 - gNoteMin);
            this.patcher.getnamed("somi1.note_max").message("set", 127 - gNoteMax);
            this.patcher.getnamed("somi1.note_threshold").message("set", gNoteThreshold);
            this.patcher.getnamed("somi1.note_gate_inverse").message("set", gNoteGateInverse);
            this.patcher.getnamed("somi1.note_pitch_inverse").message("set", gNotePitchInverse);

			outlet(1, 'bang');
		}
		break;
		case "SYSEX_CMD_CC_CFG":{

			if (len != 40){
				post('Received malformed sysex CC cfg! (len = '+ len +')\n');
				return;
			}

			
			gSensorId 	   = array[11];
			//var slotIdx  = array[12];
			gCcEnable 	   = array[13];
			gCcMidiChannel = array[14];
			gCcParam       = array[15];
			gCcController  = array[16];
			gCcHighRes     = array[17];
			gCcScale       = byteToFloat([array[18], array[19], array[20], array[21], array[22]]);
			gCcInverse     = array[23];
			gCcSlewShape   = byteToFloat([array[24], array[25], array[26], array[27], array[28]]);
			gCcSlewRise    = byteToFloat([array[29], array[30], array[31], array[32], array[33]]);
			gCcSlewFall    = byteToFloat([array[34], array[35], array[36], array[37], array[38]]);
			
			// Sets values to dictionary
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::inverse", gCcInverse);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::scale", gCcScale);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::rise", gCcSlewRise);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::fall", gCcSlewFall);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::shape", gCcSlewShape);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::midich", gCcMidiChannel);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::controller", gCcController);
			snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::highres", gCcHighRes);

			this.patcher.getnamed("somi1.cc_enable").message("set", gCcEnable);
            this.patcher.getnamed("somi1.cc_midi_channel").message("set", gCcMidiChannel+1);
            //this.patcher.getnamed("somi1.cc_param").message("set", gCcParam); // Leads to deactivation of automation in Live
            this.patcher.getnamed("somi1.cc_controller").message("set", gCcController);
            this.patcher.getnamed("somi1.cc_high_res").message("set", gCcHighRes);
            this.patcher.getnamed("somi1.cc_scale").message("set", gCcScale);
            this.patcher.getnamed("somi1.cc_inverse").message("set", gCcInverse);
            this.patcher.getnamed("somi1.cc_slew_shape").message("set", gCcSlewShape);
            this.patcher.getnamed("somi1.cc_slew_rise").message("set", gCcSlewRise);
            this.patcher.getnamed("somi1.cc_slew_fall").message("set", gCcSlewFall);
			
			outlet(1, 'bang');
		}
		break;
		case "SYSEX_CMD_PB_CFG":{

			if (len != 23){
				post('Received malformed sysex pb cfg! (len = '+ len +')\n');
				return;
			}

			gSensorId 	   = array[11];
			//var slotIndex 	= array[12];
			gPbEnable 	   = array[13];
			gPbMidiChannel = array[14];
			gPbParam 	   = array[15];
			gPbScale 	   = byteToFloat([array[16], array[17], array[18], array[19], array[20]]);
			gPbInverse 	   = array[21];


            this.patcher.getnamed("somi1.pb_enable").message("set", gPbEnable);
            this.patcher.getnamed("somi1.pb_midi_channel").message("set", gPbMidiChannel+1);
            this.patcher.getnamed("somi1.pb_param").message("set", gPbParam);
            this.patcher.getnamed("somi1.pb_scale").message("set", gPbScale);
            this.patcher.getnamed("somi1.pb_inverse").message("set", gPbInverse);

			outlet(1, 'bang');
		}
		break;
		case "SYSEX_CMD_PERSIST":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_MAPPINGS_RESET":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_DISCOVER":{

			gDiscoveryTask.cancel();
			this.patcher.getnamed("somi1.found").message("bgcolor",       0.882352941176471, 1, 0.36078431372549, 1); // 0xE1FF5C
    		this.patcher.getnamed("somi1.found").message("activebgcolor", 0.882352941176471, 1, 0.36078431372549, 1); // 0xE1FF5C
			post('Discovered SOMI-1\n');

			getSettings();

			// Request battery levels
			for (var i=0; i < 6; i++){
				outlet(0, createSysExReqBatteryLevel(i));
			}
		}
		break;
		case "SYSEX_CMD_SENSOR_CFG":{
			// For future use
		}
		break;
		case "SYSEX_CMD_SENSORS_RESET":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_DISABLE_SLOTS":{
			// Nothing todo
		}
		break;
		case "SYSEX_CMD_BATTERY_LEVEL":{

			var sensorId 	 = array[11];
			var batteryLevel = array[12];

            if (batteryLevel > 100){ // Sensor not connected
                this.patcher.getnamed("bat" + (sensorId+1)).message("set", "-");
            }
            else {
                this.patcher.getnamed("bat" + (sensorId+1)).message("set", batteryLevel + "%");
            }
		}
		break;
        case "SYSEX_CMD_SENSOR_STATE":{

            var sensorId = array[11];
            var state    = array[12];

        }
        break;
		default: // SYSEX_CMD_UNKNOWN
			post('Received SysEx message with unknown cmd ' + cmdId + '!\n');
		break;
	}
}

/**
 * Parameter listeners
 */
function sensorSelectCb(data){

    gSensorId = data.value;

	// try with sensor - may be recursive??
    getSettings();
	unsolo();
}
function ccParamCb(data){

    if (data.value != gCcParam){
        outlet(0, createSysExCmdCcCfg(false, 
                                      gSensorId, 
                                      data.value, 
                                      gCcEnable, 
                                      gCcMidiChannel, 
                                      data.value, 
                                      gCcController, 
                                      gCcHighRes, 
                                      gCcScale, 
                                      gCcInverse, 
                                      gCcSlewShape, 
                                      gCcSlewRise, 
                                      gCcSlewFall));
    }

	gCcParam = data.value;

	//this.patcher.getnamed("somi1.cc_scale").message("set", snsr[gSensorId].ccparam[gCcParam].scale);
	unsolo();
	update_UI();
}
function ccEnableCb(data) {
	gCcEnable = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::enable", data.value);
}
function ccInverseCb(data) {
	gCcInverse = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::inverse", data.value);
}
function ccScaleCb(data) { 
	gCcScale = data.value; 
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::scale", data.value);
}
function ccSlewRiseCb(data) {
	gCcSlewRise = data.value; 
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::rise", data.value);
}
function ccSlewFallCb(data) {
	gCcSlewFall = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::fall", data.value);
}
function ccSlewShapeCb(data) {
	gCcSlewShape = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::shape", data.value);
}
function ccMidiChannelCb(data) {
	gCcMidiChannel = data.value - 1;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::midich", data.value);
}
function ccControllerCb(data) {
	gCcController = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::controller", data.value);
}
function ccHighResCb(data) {
	gCcHighRes = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::highres", data.value);
}
function ccSoloCb(data){ 
    gCcSolo = data.value;
	snsr.set("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::solo", data.value);
    outlet(0, createSysExCmdCcSolo(gCcMidiChannel, gCcController, gCcSolo));
}

// change dict - send reqeust like CcParam?
function noteParamGateCb(data){ 
	gNoteParamGate = data.value;
	update_UI();
}
function noteEnableCb(data){ 
	gNoteEnable = data.value; 
	snsr.set("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::enable", data.value);
}
function noteGateInverseCb(data){ 
	gNoteGateInverse = data.value; 
	snsr.set("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::inverse", data.value);
}
function noteThresholdCb(data) {
	gNoteThreshold = data.value;
	snsr.set("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::threshold", data.value);
}

// change dict - send reqeust like CcParam?
function noteParamPitchCb(data) {
	gNoteParamPitch = data.value;
	update_UI();
}
function noteMinCb(data) {
	gNoteMin = 127 - data.value;
	snsr.set("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::note_min", data.value);
}
function noteMaxCb(data) {
	gNoteMax = 127 - data.value; 
	snsr.set("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::note_max", data.value);
}
function notePitchInverseCb(data) {
	gNotePitchInverse = data.value; 
	snsr.set("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::inverse", data.value);
}
function noteMidiChannelCb(data) {
	gNoteMidiChannel = data.value - 1;
	snsr.set("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::midich", data.value);
}

// change dict - send reqeust like CcParam?
function pbParamCb(data) {
	gPbParam = data.value;
	update_UI();
}
function pbEnableCb(data) {
	gPbEnable = data.value;
	snsr.set("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::enable", data.value);
}
function pbInverseCb(data) {
	gPbInverse = data.value;
	snsr.set("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::inverse", data.value);
}
function pbScaleCb(data) {
	gPbScale = data.value;
	snsr.set("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::scale", data.value);
}
function pbMidiChannelCb(data) {
	gPbMidiChannel = data.value - 1;
	snsr.set("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::midich", data.value);
}

function rstMappingsCb(data){
    if (data.value)
        outlet(0, createSysExCmdRstMappings());

    getSettings();
};
function rstSensorsCb(data){
    if (data.value)
        outlet(0, createSysExCmdRstSensors());
};
function applyCb(data){
    // Apply all current settings
    if (data.value){
        outlet(0, createSysExCmdCcCfg(true, 
                                      gSensorId, 
                                      gCcParam, // slot idx
                                      gCcEnable, 
                                      gCcMidiChannel, 
                                      gCcParam, 
                                      gCcController, 
                                      gCcHighRes, 
                                      gCcScale, 
                                      gCcInverse, 
                                      gCcSlewShape, 
                                      gCcSlewRise, 
                                      gCcSlewFall));

        outlet(0, createSysExCmdNoteCfg(true,
                                        gSensorId,
                                        0, // slot idx
                                        gNoteEnable,
                                        gNoteMidiChannel,
                                        gNoteParamGate,
                                        gNoteParamPitch,
                                        gNoteMin,
                                        gNoteMax,
                                        127,
                                        0,
                                        gNoteThreshold,
                                        gNoteGateInverse,
                                        gNotePitchInverse));

        outlet(0, createSysExCmdPbCfg(true,
                                      gSensorId,
                                      0, // slot idx
                                      gPbEnable,
                                      gPbMidiChannel,
                                      gPbParam,
                                      gPbScale,
                                      gPbInverse));
    }
};
function saveCb(data){
    if (data.value)
        outlet(0, createSysExCmdPersist());
};
function updateSamdCb(data){
    if (data.value)
        outlet(0, createSysExCmdUpdateSamd());
};

/**
 * Helpers
 */
function createSysExMsg(set, msgLength){

    var byteArray = Array.apply(null, Array(msgLength)).map(Number.prototype.valueOf,0);

    byteArray[0]  = 0xF0; // Start
    byteArray[1]  = SYSEX_MANF_ID[0];
    byteArray[2]  = SYSEX_MANF_ID[1];
    byteArray[3]  = SYSEX_MANF_ID[2];
    byteArray[4]  = SYSEX_DEV_IDS.indexOf("SOMI-1");
    if (set) 
        byteArray[5] = SYSEX_GET_SET_FLAGS.indexOf("SET")
    else     
        byteArray[5] = SYSEX_GET_SET_FLAGS.indexOf("GET");
    byteArray[msgLength-1] = 0xF7; // Stop

    return byteArray;
}

// Creates SysEx Control Change solo / unsolo command
function createSysExCmdCcSolo(channel, controller, soloState){

    if (soloState){ // Solo

        var midiBuf = createSysExMsg(true, 14);

        midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_CC_SOLO');
        midiBuf[SYSEX_CMD_START_IDX + 1] = channel & 0xF;
        midiBuf[SYSEX_CMD_START_IDX + 2] = controller & 0x7F;

        return midiBuf;

    } else { // Unsolo

        var midiBuf = createSysExMsg(true, 12);

        midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_CC_UNSOLO');

        return midiBuf;
    }
}

// Creates SysEx Note config command
function createSysExCmdNoteCfg(set, 
                               sensorId, 
                               slotIdx, 
                               enabled, 
                               channel,
                               paramGate,
                               paramNote,
                               noteMin,
                               noteMax,
                               velocityOn,
                               velocityOff,
                               threshold,
                               gateInverse,
                               pitchInverse){

    var midiBuf = createSysExMsg(set, 29);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_NOTE_CFG');

    midiBuf[SYSEX_CMD_START_IDX +  1] = sensorId & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  2] = slotIdx & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  3] = enabled & 0x1;
    midiBuf[SYSEX_CMD_START_IDX +  4] = channel & 0xF;
    midiBuf[SYSEX_CMD_START_IDX +  5] = paramGate & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  6] = paramNote & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  7] = noteMin & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  8] = noteMax & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  9] = velocityOn & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX + 10] = velocityOff & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX + 11] = floatToByte(threshold)[0];
    midiBuf[SYSEX_CMD_START_IDX + 12] = floatToByte(threshold)[1];
    midiBuf[SYSEX_CMD_START_IDX + 13] = floatToByte(threshold)[2];
    midiBuf[SYSEX_CMD_START_IDX + 14] = floatToByte(threshold)[3];
    midiBuf[SYSEX_CMD_START_IDX + 15] = floatToByte(threshold)[4];
    midiBuf[SYSEX_CMD_START_IDX + 16] = gateInverse;
    midiBuf[SYSEX_CMD_START_IDX + 17] = pitchInverse;

    return midiBuf;
}

// Creates SysEx Control Change config command
function createSysExCmdCcCfg(set,
                             sensorId,
                             slotIdx,
                             enabled,
                             channel,
                             param,
                             controller,
                             highRes,
                             scale,
                             inverse,
                             slewShape,
                             slewRise,
                             slewFall){

    var midiBuf = createSysExMsg(set, 40);

    midiBuf[SYSEX_CMD_START_IDX +  0] = SYSEX_CMDS.indexOf('SYSEX_CMD_CC_CFG');
    midiBuf[SYSEX_CMD_START_IDX +  1] = sensorId & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  2] = slotIdx & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  3] = enabled & 0x1;
    midiBuf[SYSEX_CMD_START_IDX +  4] = channel & 0xF;
    midiBuf[SYSEX_CMD_START_IDX +  5] = param & 0xF;
    midiBuf[SYSEX_CMD_START_IDX +  6] = controller & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  7] = highRes & 0x1;
    midiBuf[SYSEX_CMD_START_IDX +  8] = floatToByte(scale)[0];
    midiBuf[SYSEX_CMD_START_IDX +  9] = floatToByte(scale)[1];
    midiBuf[SYSEX_CMD_START_IDX + 10] = floatToByte(scale)[2];
    midiBuf[SYSEX_CMD_START_IDX + 11] = floatToByte(scale)[3];
    midiBuf[SYSEX_CMD_START_IDX + 12] = floatToByte(scale)[4];
    midiBuf[SYSEX_CMD_START_IDX + 13] = inverse;
    midiBuf[SYSEX_CMD_START_IDX + 14] = floatToByte(slewShape)[0];
    midiBuf[SYSEX_CMD_START_IDX + 15] = floatToByte(slewShape)[1];
    midiBuf[SYSEX_CMD_START_IDX + 16] = floatToByte(slewShape)[2];
    midiBuf[SYSEX_CMD_START_IDX + 17] = floatToByte(slewShape)[3];
    midiBuf[SYSEX_CMD_START_IDX + 18] = floatToByte(slewShape)[4];
    midiBuf[SYSEX_CMD_START_IDX + 19] = floatToByte(slewRise)[0];
    midiBuf[SYSEX_CMD_START_IDX + 20] = floatToByte(slewRise)[1];
    midiBuf[SYSEX_CMD_START_IDX + 21] = floatToByte(slewRise)[2];
    midiBuf[SYSEX_CMD_START_IDX + 22] = floatToByte(slewRise)[3];
    midiBuf[SYSEX_CMD_START_IDX + 23] = floatToByte(slewRise)[4];
    midiBuf[SYSEX_CMD_START_IDX + 24] = floatToByte(slewFall)[0];
    midiBuf[SYSEX_CMD_START_IDX + 25] = floatToByte(slewFall)[1];
    midiBuf[SYSEX_CMD_START_IDX + 26] = floatToByte(slewFall)[2];
    midiBuf[SYSEX_CMD_START_IDX + 27] = floatToByte(slewFall)[3];
    midiBuf[SYSEX_CMD_START_IDX + 28] = floatToByte(slewFall)[4];

    return midiBuf;
}

// Creates SysEx Pitch Bend config command
function createSysExCmdPbCfg(set,
                             sensorId,
                             slotIdx,
                             enabled,
                             channel,
                             param,
                             scale,
                             inverse){

    var midiBuf = createSysExMsg(set, 23);

    midiBuf[SYSEX_CMD_START_IDX +  0] = SYSEX_CMDS.indexOf('SYSEX_CMD_PB_CFG');
    midiBuf[SYSEX_CMD_START_IDX +  1] = sensorId & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  2] = slotIdx & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  3] = enabled & 0x1;
    midiBuf[SYSEX_CMD_START_IDX +  4] = channel & 0xF;
    midiBuf[SYSEX_CMD_START_IDX +  5] = param & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX +  6] = floatToByte(scale)[0];
    midiBuf[SYSEX_CMD_START_IDX +  7] = floatToByte(scale)[1];
    midiBuf[SYSEX_CMD_START_IDX +  8] = floatToByte(scale)[2];
    midiBuf[SYSEX_CMD_START_IDX +  9] = floatToByte(scale)[3];
    midiBuf[SYSEX_CMD_START_IDX + 10] = floatToByte(scale)[4];
    midiBuf[SYSEX_CMD_START_IDX + 11] = inverse & 0x1;

    return midiBuf;
}

// Creates SysEx persist command
function createSysExCmdPersist(){

    var midiBuf = createSysExMsg(true, 12);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_PERSIST');

    return midiBuf;
}

// Creates SysEx mapping reset command
function createSysExCmdRstMappings(){

    var midiBuf = createSysExMsg(true, 12);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_MAPPINGS_RESET');

    return midiBuf;
}

// Creates SysEx discovery request
function createSysExReqDiscovery(){

    var midiBuf = createSysExMsg(false, 12);
	
	midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_DISCOVER');

	return midiBuf;
}

// Creates SysEx sensor reset command
function createSysExCmdRstSensors(){

    var midiBuf = createSysExMsg(true, 12);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_SENSORS_RESET');

    return midiBuf;
}

// Creates SysEx disable slots command
function createSysExCmdSlotsDisable(){

    var midiBuf = createSysExMsg(true, 12);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_DISABLE_SLOTS');

    return midiBuf;
}

// Creates SysEx battery level request
function createSysExReqBatteryLevel(sensorId){

    var midiBuf = createSysExMsg(false, 14);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_BATTERY_LEVEL');
    midiBuf[SYSEX_CMD_START_IDX + 1] = sensorId & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX + 2] = 0;

    return midiBuf;
}

// Creates SysEx sensor state request
function createSysExReqSensorState(sensorId){

    var midiBuf = createSysExMsg(false, 14);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_SENSOR_STATE');
    midiBuf[SYSEX_CMD_START_IDX + 1] = sensorId & 0x7F;
    midiBuf[SYSEX_CMD_START_IDX + 2] = 0;

    return midiBuf;
}

// Creates SysEx command to put SAMD in Update mode (i.e. is detected as Arduino device)
function createSysExCmdUpdateSamd(){

    var midiBuf = createSysExMsg(true, 12);

    midiBuf[SYSEX_CMD_START_IDX + 0] = SYSEX_CMDS.indexOf('SYSEX_CMD_UPDATE_SAMD');

    return midiBuf;
}

// Create SysEx request for CC, Notes and Pitch Bend settings
function getSettings(){

    outlet(0, createSysExCmdCcCfg(false, 
                                  gSensorId, 
                                  gCcParam, // slot idx
                                  gCcEnable, 
                                  gCcMidiChannel, 
                                  gCcParam, 
                                  gCcController, 
                                  gCcHighRes, 
                                  gCcScale, 
                                  gCcInverse, 
                                  gCcSlewShape, 
                                  gCcSlewRise, 
                                  gCcSlewFall));

    outlet(0, createSysExCmdNoteCfg(false,
                                    gSensorId,
                                    0, // slot idx
                                    gNoteEnable,
                                    gNoteMidiChannel,
                                    gNoteParamGate,
                                    gNoteParamPitch,
                                    gNoteMin,
                                    gNoteMax,
                                    127,
                                    0,
                                    gNoteThreshold,
                                    gNoteGateInverse,
                                    gNotePitchInverse));

    outlet(0, createSysExCmdPbCfg(false,
                                  gSensorId,
                                  0, // slot idx
                                  gPbEnable,
                                  gPbMidiChannel,
                                  gPbParam,
                                  gPbScale,
                                  gPbInverse));
}

// Observes re-enable-automation button in Live via Live Object Model (LOM) API.
/*
liveApi = 0;
function startReenableAutomationObserver(){
	liveApi = new LiveAPI(function(args){
		post('Live API callback: ' + args + '\n');

		// TODO: Only reenable automations for parameters of this M4L device.

		if (args[0] === 're_enable_automation_enabled' && args[1] === 1){
			post('Triggered reenable automation.\n');
			liveApi.call('re_enable_automation');
		}

    }, 'live_set'); // Sometimes Live API not initialized yet => use live.thisdevice
    liveApi.property = ['re_enable_automation_enabled'];
}
*/

// Converts byte (i.e. uint8_t) array to float
function byteToFloat(byteArray){

	var bytes = new Uint32Array(1);
	
	bytes[0] |= ((byteArray[0] & 0x0F) << 28);
	bytes[0] |= ((byteArray[1] & 0x7F) << 21);
	bytes[0] |= ((byteArray[2] & 0x7F) << 14);
	bytes[0] |= ((byteArray[3] & 0x7F) <<  7);
	bytes[0] |= ((byteArray[4] & 0x7F) <<  0);
	
	var farr = new Float32Array(bytes.buffer);
	
	return farr[0];
}

// Converts float to byte (i.e. uint8_t) array
function floatToByte(floatVal){

    var farr = new Float32Array(1);
    farr[0] = floatVal;
    var bytes = new Uint32Array(farr.buffer);
    
    var byteArray = new Uint8Array(5);
    byteArray[0] = bytes[0] >> 28 & 0x0F;
    byteArray[1] = bytes[0] >> 21 & 0x7F;
    byteArray[2] = bytes[0] >> 14 & 0x7F;
    byteArray[3] = bytes[0] >>  7 & 0x7F;
    byteArray[4] = bytes[0] >>  0 & 0x7F;
    
    return byteArray;
}

// Unsolo all when param changes 
function unsolo() {
	for (sid = 0; sid < 6; sid++) {
		for (i = 0; i < 7; i++) {
			snsr.set("sensor["+sid+"]::ccparam["+i+"]::solo", 0);
			//this.patcher.getnamed("somi1.cc_solo").message("set", 0);
		}
	}
} 
// Updates all parameters shown in the UI by the live objects
function update_UI() {

	// Control Change Section
	this.patcher.getnamed("somi1.cc_enable").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::enable"));
	this.patcher.getnamed("somi1.cc_inverse").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::inverse"));
	this.patcher.getnamed("somi1.cc_scale").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::scale"));
	this.patcher.getnamed("somi1.cc_slew_rise").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::rise"));
	this.patcher.getnamed("somi1.cc_slew_fall").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::fall"));
	this.patcher.getnamed("somi1.cc_slew_shape").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::shape"));
	this.patcher.getnamed("somi1.cc_midi_channel").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::midich"));
	this.patcher.getnamed("somi1.cc_controller").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::controller"));
	this.patcher.getnamed("somi1.cc_high_res").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::highres"));
	this.patcher.getnamed("somi1.cc_solo").message("set", snsr.get("sensor["+gSensorId+"]::ccparam["+gCcParam+"]::solo"));

	// Note Gate Section
	this.patcher.getnamed("somi1.note_enable").message("set", snsr.get("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::enable"));
	this.patcher.getnamed("somi1.note_gate_inverse").message("set", snsr.get("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::inverse"));
	this.patcher.getnamed("somi1.note_threshold").message("set", snsr.get("sensor["+gSensorId+"]::note_gate["+gNoteParamGate+"]::threshold"));

	// Note Pitch Section
	this.patcher.getnamed("somi1.note_midi_channel").message("set", snsr.get("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::midich"));
	this.patcher.getnamed("somi1.note_pitch_inverse").message("set", snsr.get("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::inverse"));
	this.patcher.getnamed("somi1.note_min").message("set", snsr.get("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::note_min"));
	this.patcher.getnamed("somi1.note_max").message("set", snsr.get("sensor["+gSensorId+"]::note_pitch["+gNoteParamPitch+"]::note_max"));

	// Pitch bend Section
	this.patcher.getnamed("somi1.pb_enable").message("set", snsr.get("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::enable"));
	this.patcher.getnamed("somi1.pb_inverse").message("set", snsr.get("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::inverse"));
	this.patcher.getnamed("somi1.pb_scale").message("set", snsr.get("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::scale"));
	this.patcher.getnamed("somi1.pb_midi_channel").message("set", snsr.get("sensor["+gSensorId+"]::pitchbend["+gPbParam+"]::midich"));
}

// Resets dictionary to default
function reset_dictionary() {
	snsr.clear();
	var sensors = new Array(6);
	for (i = 0; i < 6; i++) {
		var ccparameters = [];
		var note_gates = [];
		var note_pitches = [];
		var pitch_bends = [];

		for (k = 0; k < 7; k++) {
			ccparameters[k] = {
				enable: 0,
				inverse: 0,
				scale: 1,
				rise: 0,
				fall: 0,
				shape: 0,
				midich: 1,
				controller: 16,
				highres: 0,
				solo: 0
			};
			note_gates[k] = {
				enable: 0,
				inverse: 0,
				threshold: 1
			};
			note_pitches[k] = {
				note_min: 0,
				note_max: 0,
				inverse: 0,
				midich: 1
			};
			pitch_bends[k] = {
				enable: 0,
				inverse: 0,
				scale: 0,
				midich: 1
			};
		}
		sensors[i] = {
			ccparam: ccparameters,
			note_gate: note_gates,
			note_pitch: note_pitches,
			pitchbend: pitch_bends
		}
	}
	var tmp_dict = {
		sensor: sensors
	}
	snsr.parse(JSON.stringify(tmp_dict));
	update_UI();
}
