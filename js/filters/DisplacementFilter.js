/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The DisplacementFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
 * You can use this filter to apply all manor of crazy warping effects
 * Currently the r property of the texture is used offset the x and the g propery of the texture is used to offset the y.
 * @class DisplacementFilter
 * @contructor
 * @param texture {Texture} The texture used for the displacemtent map * must be power of 2 texture at the moment
 */
PIXI.DisplacementFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];
    texture.baseTexture._powerOf2 = true;

    // set the uniforms
    this.uniforms = {
        displacementMap: {type: 'sampler2D', value:texture},
        //scale:           {type: '2f', value:{x:30, y:30}},
        offset:          {type: '2f', value:{x:0, y:0}},
        //mapDimensions:   {type: '2f', value:{x:512, y:512}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    if(texture.baseTexture.hasLoaded)
    {
        //this.uniforms.mapDimensions.value.x = texture.width;
        //this.uniforms.mapDimensions.value.y = texture.height;
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);

        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D displacementMap;',
        'uniform sampler2D uSampler;',
        //'uniform vec2 scale;',
        'uniform vec2 offset;',
        'uniform vec4 dimensions;',
        //'uniform vec2 mapDimensions;',// = vec2(256.0, 256.0);',
        // 'const vec2 textureDimensions = vec2(750.0, 750.0);',

        'void main(void) {',
        ' const vec2 scale = vec2(30, 30);',
        ' const vec2 mapDimensions = vec2(512, 512);',

        '   vec2 mapCords = vTextureCoord.xy;',
        //'   mapCords -= ;',
        '   mapCords += (dimensions.zw + offset)/ dimensions.xy ;',
        '   mapCords.y *= -1.0;',
        '   mapCords.y += 1.0;',
        '   vec2 matSample = texture2D(displacementMap, mapCords).xy;',
        '   matSample -= 0.5;',
        '   matSample *= scale;',
        '   matSample /= mapDimensions;',
         '   vec2 coord = vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y);',

        '   vec2 size = dimensions.xy/3.0;',

        '   vec2 color = floor( ( vTextureCoord * size ) ) / size + 3.0/dimensions.xy * 0.5;',
        '   gl_FragColor = texture2D(uSampler, color);',
        //'   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);',
        //'   vec2 cord = vTextureCoord;',

        //'   gl_FragColor =  texture2D(displacementMap, cord);',
        //'   gl_FragColor = vec4(1, 0, 0, 1);',
        '}'
    ];
};

PIXI.DisplacementFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.DisplacementFilter.prototype.constructor = PIXI.DisplacementFilter;

PIXI.DisplacementFilter.prototype.onTextureLoaded = function()
{
    //this.uniforms.mapDimensions.value.x = this.uniforms.displacementMap.value.width;
    //this.uniforms.mapDimensions.value.y = this.uniforms.displacementMap.value.height;

    this.uniforms.displacementMap.value.baseTexture.off('loaded', this.boundLoadedFunction);
};

/**
 * The texture used for the displacemtent map * must be power of 2 texture at the moment
 *
 * @property map
 * @type Texture
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'map', {
    get: function() {
        return this.uniforms.displacementMap.value;
    },
    set: function(value) {
        this.uniforms.displacementMap.value = value;
    }
});

/**
 * The multiplier used to scale the displacement result from the map calculation.
 *
 * @property scale
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'scale', {
    get: function() {
        return 0;// this.uniforms.scale.value;
    },
    set: function(value) {
       // this.uniforms.scale.value = value;
    }
});

/**
 * The offset used to move the displacement map.
 *
 * @property offset
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'offset', {
    get: function() {
        return this.uniforms.offset.value;
    },
    set: function(value) {
        this.uniforms.offset.value = value;
    }
});
