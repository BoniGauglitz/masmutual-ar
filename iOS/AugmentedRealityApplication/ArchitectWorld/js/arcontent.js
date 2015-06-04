var World = {
	loaded: false,

	init: function initFn() {
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		
        /* 1. Initialize ClientTracker with packaged targets from:
           http://www.wikitude.com/developer/tools/target-collections*/
		this.tracker = new AR.ClientTracker("assets/MM_DemoTargets.wtc", {
			onLoaded: this.worldLoaded
		});
		/* 2. Initialize local objects */
		var video = new AR.VideoDrawable("assets/family.m4v", 1.0, { offsetX: -.1, });
        var videoIsPlaying=false;
        
        /* 3. Set up trackers to handle image recognition events */
        
        /* familyTracker: 
           Recognizes MM_ARVideoTarget.jpg in MM_DemoTargets.wtc
           When MM_ARVideoTarget is recognized:
            • check if other videos are playing and stop them,
            • play family.m4v in a native player  */
		var familyTracker = new AR.Trackable2DObject(this.tracker, "MM_ARV*", {
        
            onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
                  if(videoIsPlaying){
                       video.pause();
                  }
                  AR.context.startVideoPlayer("assets/family.m4v");
            }
         });
        
        /*  locationTracker 
            Recognizes MM_ARMapMarker.png in MM_DemoTargets.wtc
            When MM_ARMapMarker is recognized:
            • check if other videos are playing and stop them,
            • open location finder URL in browser */
        var locationTracker = new AR.Trackable2DObject(this.tracker, "MM_ARM*", {
             
             onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
                    if(videoIsPlaying){
                       video.pause();
                    }
                    AR.context.openInBrowser("https://www.massmutual.com/connect-with-us/financial-professionals");
             }
        });
        
        /*  inPlaceFamilyTracker
            Recognizes MM_ARCouple.png in MM_DemoTargets.wtc
            When MM_ARCouple is recognized:
            • check if video is playing:
                • if it is, resume playing
                • if it's not, play video in place over image target and update flag
            When MM_ARCouple leaves field of vision
            • pause video      */
        var inPlaceFamilyTracker = new AR.Trackable2DObject(this.tracker, "MM_ARC*", {
            drawables: { cam: video },
            onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
                  if(!videoIsPlaying){
                    video.play(-1);
                    videoIsPlaying=true;
                  }
                  else{
                    video.resume();
                 }
            },
            onExitFieldOfVision: function onExitFieldOfVisionFn(){
                  video.pause();
            }
        });
	},

	worldLoaded: function worldLoadedFn() {
		// Remove loading message once loaded
        var e = document.getElementById('loadingMessage');
        e.parentElement.removeChild(e);
	}
};

World.init();
