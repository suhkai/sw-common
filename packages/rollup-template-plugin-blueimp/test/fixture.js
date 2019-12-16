const template = `
<html lang="en">
<head>
    {% for (var i=0; i<o.inject_html.length; i++) { %}
        <!--{%=o.inject_html[i].comment%} --> 
        {% for (var j=0; j<o.inject_html[i].tags.length; j++) { %}
        {%   var tag = o.inject_html[i].tags[j].name;   %}
             <{%print(tag)%}></{%print(tag)%}>
            
        <li>{%=o.features[i]%}</li>
    {% } %}
    <!--general meta section-->
    {% for (var i=0; i<o.features.length; i++) { %}
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <!--android section-->
    <meta content="yes" name="mobile-web-app-capable">
    <meta content="#fff" name="theme-color">
    <meta content="appName" name="application-name">
    <!--windows section-->
    <meta content="#fff" name="msapplication-TileColor">
    <meta content="somepath/mstile-144x144.png" name="msapplication-TileImage">
    <!--android section-->
    <link href="android/manifest.json" rel="manifest">
    <!--appleStartup section-->
    <link href="apple-touch-startup-image-320x460.png"
        media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-640x920.png"
        media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-640x1096.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-750x1294.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1182x2208.png"
        media="(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1242x2148.png"
        media="(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-748x1024.png"
        media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-768x1004.png"
        media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1496x2048.png"
        media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1536x2008.png"
        media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image">
    <!--favicons section-->
    <link href="normative/favicon.ico" rel="shortcut icon">
    <link href="normative/favicon-16x16.png" rel="icon" sizes="16x16"
        type="image/png">
    <link href="normative/favicon-32x32.png" rel="icon" sizes="32x32"
        type="image/png">
    <title>rollup.js test app</title>
    <base href="http://jacob-bogers.com" target="_blank">
    <link href="bundlexyz.js" rel="stylesheet">
</head>

<body>
    <div id="myApp"></div>
    <script src="bundlexyz.js"></script>
</body>

</html>
`;
