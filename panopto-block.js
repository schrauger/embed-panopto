wp.blocks.registerBlockType('panopto-embed/panopto-block', {
    title: 'Panopto Playlist',
    icon: 'playlist-video',
    category: 'embed',
    attributes: {
        playlistID: {type: 'string', default: ""},
        submitted: {type: 'boolean', default: false }
    },

    edit: function(props) {

        /**
         * Save playlist id in state. Unset the submitted flag.
         * @param event
         */
        function updatePlaylistID(event) {
            props.setAttributes({
                playlistID: event.target.value,
                submitted: false // if the user edits the pid, unsubmit it - that way, they can edit it and not constantly see render errors
            });
        }

        /**
         * Set the submitted flag, as long as the playlistID exists.
         * @param event
         */
        function formSubmit(event){
            console.log('submitting');
            event.preventDefault(); // don't actually submit the form
            if (props.attributes.playlistID){
                props.setAttributes({submitted: true}) // rerender the attributes with the embed instead of the form
            }
        }

        return (
             // if user has not submitted the id (or id is null), render the form. else, render the iframe inside the block
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

                ((props.attributes.playlistID && props.attributes.submitted)) ? (// after they click submit, remove the form elements and render the iframe inside the block.
                // note: the user must delete the block and re-add it if they want to embed a different playlist.
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
                ) : (
                    React.createElement(
                        "div",
                        null,
                        "Enter a playlist ID and click embed"
                    )
                )
            )
        )
    },

    save: function(props) {
        // this can simply return 'null', which tells wordpress to just save the input attributes.
        // however, by actually saving the html, this saves the html in the database as well, which means
        // that our plugin can be disabled and the old pages will still have iframe html. however, if an unprivileged
        // user edits that page, the iframe code will be stripped out upon saving.
        // due to the html filtering, this return is not strictly used, as the server-side render method overwrites
        // this when printing onto the page (but that allows us to print out raw html without filtering, regardless of user).
        return (props.attributes.playlistID && props.attributes.submitted) ? // only create the iframe if playlistID is defined and form is submitted
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
            ) : (
                null
            )
    }

});