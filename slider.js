angular.module("slider.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slider.html",
		    "<style>\n"+
		    ".slider-target {\n"+
		    "  position: relative;\n"+
  		    "  width: 90%;\n"+
  		    "  height: 20px;\n"+
  		    "  display: inline-block;\n"+
  		    "  border-radius: 4px;\n"+
  		    "  border: 1px solid #e0e0e0;\n"+
  		    "  background-color: red;\n"+
		    "}\n"+
		    ".slider-origin {\n"+
  		    "  position: absolute;\n"+
  		    "  top: 0;\n"+
  		    "  left: 0;\n"+
  		    "  bottom: 0;\n"+
  		    "  right: 0;\n"+
		    "}\n"+
		    ".slider-positive {\n"+
  		    "  position: absolute;\n"+
  		    "  top: 0;\n"+
  		    "  left: 0;\n"+
  		    "  bottom: 0;\n"+
  		    "  right: 0;\n"+
  		    "  background-color:blue;\n"+
  		    "  border-top-right-radius:4px;\n"+
  		    "  border-bottom-right-radius:4px;\n"+
		    "}\n"+
		    ".slider-handle {\n"+
  		    "  position: relative;\n"+
  		    "  width: 20px;\n"+
  		    "  height: 18px;\n"+
  		    "  left: -10px;\n"+
  		    "  display: inline-block;\n"+
  		    "  background-color: #202020;\n"+
  		    "  cursor: \"pointer\";\n"+
		    "}\n"+
		    ".slider-icon {\n"+
  		    "  position: relative;\n"+
 		    "  font-size: 28px;\n"+
  		    "  top: -5px;\n"+
  		    "  left: -3px;\n"+
  		    "  color: green;\n"+
		    "}\n"+
			"</style>\n"+
		    "<div class=\"slider-positive\"></div>\n"+
		    "<div class=\"slider-origin\">\n"+
			"  <div class=\"slider-handle\">\n"+
			"    <span class=\"glyphicon glyphicon-expand slider-icon\"></span>\n"+
			"  </div>\n"+
			"</div>\n"
    );
}]);
angular.module("slider", ["slider.html"])
      .directive('mySlider', ['$document', function($document) {
        return {
          templateUrl: function(element, attrs) {
            return attrs.templateUrl || 'slider.html'
          },
	      scope: {
	        min: "=slidermin",
	        max: "=slidermax",
            value: "=sliderval",	  
	      },
          link: function(scope, element, attr) {
            var startX = 0;
	        var x = 0;
            var targetWidth = 0;
	        var valueRange = 0;
	        var startValue = 0;
	  
	        // make sure the value for the slider handle position
	        // is within the range of the control
            var clip = function(range, value){
		      return Math.min(range.max, Math.max(range.min, value));
	        }
	  
            // calculate the percentage position of the zero position
            // for controls where the range goes from negative to positive
            var zeroPos = function() {
              var zero = ((scope.min * -100)/(scope.max - scope.min))
	          if ( zero > 100 ) {
		        zero = 100
	          }
	          else if ( zero < 0 ) {
		        zero = 0
	          }
              return zero + "%";	  
	        } 
	  
            // calculate the percentage position of the left edge
	        // of the slider-origin element
            var handlePos = function() {
	          var val = (((scope.value-scope.min) * 100)/(scope.max - scope.min))
		      if ( val > 100 ) {
		        val = 100
		      }
		      else if ( val < 0 ) {
		        val = 0
		      }
		      return val + "%";
	        }

			element.addClass('slider-target');
	        // find the handle element;
	        var elHandle = null;
	        var elOrigin = null;
	        var elZero = null;
	  
	        var children = element.children();
	        for (var i=0; i<children.length; i++) {
	          if (children.eq(i).hasClass('slider-origin')) {
		        elOrigin = children.eq(i);
		        var grandchildren = elOrigin.children();
		        for (var j=0; j<grandchildren.length; j++) {
		          if (grandchildren.eq(j).hasClass('slider-handle')) {
			        elHandle = grandchildren.eq(j);
			      }
	            }
		      }
		      else if (children.eq(i).hasClass('slider-positive')) {
		        elZero = children.eq(i);
		      }
            }
			if (elZero) {
              elZero.css('left', zeroPos());
			}
            scope.value = clip({min:scope.min, max:scope.max}, scope.value);	  
            elOrigin.css('left', handlePos());
	  
	        //watchers
			scope.$watch('value', function(newValue) {
	          elOrigin.css('left', handlePos())
	        });
	        scope.$watch('min', function(newValue) {
	          if (elZero) {
			    elZero.css('left', zeroPos());
		      }
		      elOrigin.css('left', handlePos());
	        });
	        scope.$watch('max', function(newValue) {
	          if (elZero) {
			    elZero.css('left', zeroPos());
			  }
		      elOrigin.css('left', handlePos());
	        });
	  
            elHandle.on('mousedown', function(event) {
	          targetWidth = parseInt(element.prop('offsetWidth'));
		      valueRange = scope.max - scope.min;
		
              // Prevent default dragging of selected content
              event.preventDefault();
              startX = event.pageX;
		      startValue = parseInt(scope.value);
              $document.on('mousemove', mousemove);
              $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
              x = event.pageX - startX;
	          scope.$apply(function() {
		        scope.value = clip({min:scope.min, max:scope.max}, startValue + (x*valueRange)/targetWidth);
		      })
		      elOrigin.css('left', handlePos());
		      lastX = x;
            }

            function mouseup() {
              $document.off('mousemove', mousemove);
              $document.off('mouseup', mouseup);
            }
          }
        };
      }]);
