load('steal/file/file.js')

var i, fileName, cmd, 
	plugins = [
	"class", 
	"controller",
	"event/default",
	"event/destroyed",
	"event/drag",
	{
		plugin: "event/drag/limit", 
		exclude: ["jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	{
		plugin: "event/drag/scroll", 
		exclude: ["jquery/dom/within/within.js", "jquery/dom/compare/compare.js", "jquery/event/drop/drop.js","jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	{
		plugin: "event/drop",
		exclude: ["jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	"event/hover",
	"model",
	"view/ejs", 
	"dom/closest",
	"dom/compare",
	"dom/dimensions",
	"dom/fixture",
	"dom/form_params",
	"dom/within"
]


var plugin, exclude, fileDest;
for(i=0; i<plugins.length; i++){
	plugin = plugins[i];
	exclude = [];
	if (typeof plugin != "string") {
		plugin = plugins[i].plugin;
		exclude = plugins[i].exclude;
	}
	fileName = "jquery."+plugin.replace(/\//g, ".").replace(/dom\./, "")+".js";
	fileDest = "jquery/dist/"+fileName
	cmd = "js steal/scripts/pluginify.js jquery/"+plugin+" -destination "+fileDest;
	if(exclude.length)
		cmd += " -exclude "+exclude;
	runCommand(	"cmd", "/C", cmd)
	
	// compress 
	var outBaos = new java.io.ByteArrayOutputStream();
	var output = new java.io.PrintStream(outBaos);
	runCommand("java", "-jar", "steal/rhino/compiler.jar", "--compilation_level",
    	"SIMPLE_OPTIMIZATIONS", "--warning_level","QUIET",  "--js", fileDest, {output: output});
	
    var minFileDest = fileDest.replace(".js", ".min.js")
	new steal.File(minFileDest).save(outBaos.toString());
	print("***"+fileName+" pluginified and compressed")
}
