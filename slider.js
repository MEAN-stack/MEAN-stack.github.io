angular.module("slider", [])
      .directive('mySlider', ['$document', function($document) {
        return {
          template: 
		    '<style>'+
		    '.slider-target {'+
		    '  position: relative;'+
  		    '  width: 90%;'+
  		    '  height: 20px;'+
  		    '  display: inline-block;'+
  		    '  border-radius: 4px;'+
  		    '  border: 1px solid #e0e0e0;'+
  		    '  background-color: red;'+
		    '}'+
		    '.slider-origin {'+
  		    '  position: absolute;'+
  		    '  top: 0;'+
  		    '  left: 0;'+
  		    '  bottom: 0;'+
  		    '  right: 0;'+
		    '}'+
		    '.slider-positive {'+
  		    '  position: absolute;'+
  		    '  top: 0;'+
  		    '  left: 0;'+
  		    '  bottom: 0;'+
  		    '  right: 0;'+
  		    '  background-color:blue;'+
  		    '  border-top-right-radius:4px;'+
  		    '  border-bottom-right-radius:4px;'+
		    '}'+
		    '.slider-handle {'+
  		    '  position: relative;'+
  		    '  width: 20px;'+
  		    '  height: 18px;'+
  		    '  left: -10px;'+
  		    '  display: inline-block;'+
  		    '  background-color: #202020;'+
  		    '  cursor: "pointer";'+
		    '}'+
		    '.slider-icon {'+
  		    '  position: relative;'+
 		    '  font-size: 28px;'+
  		    '  top: -5px;'+
  		    '  left: -3px;'+
  		    '  color: green;'+
		    '}'+
			'</style>'+
		    '<div class="slider-positive"></div>'+
		    '<div class="slider-origin">'+
			'  <div class="slider-handle">'+
			'    <span class="glyphicon glyphicon-expand slider-icon"></span>'+
			'  </div>'+
			'</div>',
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
              var zero = ((scope.min * -100)/(scope.max - scope.min + 1))
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
	          var val = (((scope.value-scope.min) * 100)/(scope.max - scope.min + 1))
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
            elZero.css('left', zeroPos());
            scope.value = clip({min:scope.min, max:scope.max}, scope.value);	  
            elOrigin.css('left', handlePos());
	  
	        //watchers
			scope.$watch('value', function(newValue) {
	          elOrigin.css('left', handlePos())
	        });
	        scope.$watch('min', function(newValue) {
	          elZero.css('left', zeroPos());
		      elOrigin.css('left', handlePos());
	        });
	        scope.$watch('max', function(newValue) {
	          elZero.css('left', zeroPos());
		      elOrigin.css('left', handlePos());
	        });
	  
            elHandle.on('mousedown', function(event) {
	          targetWidth = parseInt(element.prop('offsetWidth'));
		      valueRange = scope.max - scope.min + 1;
		
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
