wp.blocks.registerBlockType('brad/border-box', {
    title: 'Panopto Playlist',
    icon: 'playlist-video',
    category: 'embed',
    attributes: {
        playlistID: {type: 'string', default: ""},
        submitted: {type: 'boolean', default: false }
    },

    edit: function(props) {
        function updatePlaylistID(event) {
            props.setAttributes({playlistID: event.target.value});
        }

        function formSubmit(event){
            console.log('submitting');
            event.preventDefault(); // don't actually submit the form
            if (props.attributes.playlistID){
                props.setAttributes({submitted: true}) // rerender the attributes with the embed instead of the form
            }
        }

        return (
            (!(props.attributes.playlistID && props.attributes.submitted)) ? ( // if user has not submitted the id (or id is null), render the form. else, render the iframe inside the block
                React.createElement(
                    "form",
                    {
                        onSubmit: formSubmit
                    },
                    React.createElement(
                        "h3",
                        null,
                        "Panopto Playlist Embed"
                    ),
                    React.createElement(
                        "label",
                        {
                            for: 'panoptoPlaylistID'
                        },
                        "Playlist ID (pid)"
                    ),
                    React.createElement(
                        "input",
                        {
                            type: "string",
                            value: props.attributes.playlistID,
                            onChange: updatePlaylistID,
                            name: "panoptoPlaylistID"
                        }
                    ),
                    React.createElement(
                        "input",
                        {
                            type: "submit",
                            value: "Embed",
                            className: "components-button is-button is-default is-large"
                        }
                    ),
                )
            ): ( // after they click submit, remove the form elements and render the iframe inside the block.
            // note: the user must delete the block and re-add it if they want to embed a different playlist.
                (props.attributes.playlistID && props.attributes.submitted) ? // only create the iframe if playlistID is defined and form is submitted
                    (
                        React.createElement(
                            "iframe",
                            {
                                src: "https://ucf.hosted.panopto.com/Panopto/Pages/Embed.aspx?pid=" + props.attributes.playlistID + "&v=1",
                                width: 720,
                                height: 405,
                                frameborder: 0,
                                allowfullscreen: true,
                                allow: 'autoplay'
                            }
                        )
                    ) : ( null )
            )
        )
    },

    save: function(props) {
        return wp.element.createElement(
            "iframe",
            {
                src: "https://ucf.hosted.panopto.com/Panopto/Pages/Embed.aspx?pid=" + props.attributes.playlistID + "&v=1",
                width: 720,
                height: 405,
                frameborder: 0,
                allowfullscreen: true,
                allow: 'autoplay'
            }
        )
    }

});