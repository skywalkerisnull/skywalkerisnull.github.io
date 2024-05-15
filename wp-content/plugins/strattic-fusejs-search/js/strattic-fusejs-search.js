document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById( 'main' );

	const excerpt_template = `
    <li class="wp-block-post block-editor-block-list__layout" data-is-drop-zone="true">
        <figure tabindex="0" class="block-editor-block-list__block wp-block wp-block-post-featured-image"
            id="block-ab784456-2067-4b07-85ed-28274387299d" role="document"
            aria-label="Block: Featured Image" data-block="ab784456-2067-4b07-85ed-28274387299d"
            data-type="core/post-featured-image" data-title="Featured Image">
            <a href="{{home_url}}{{path}}" target="_self" aria-disabled="true">
                <img src="{{hero_image}}" alt="Featured image" style="object-fit:cover; width:150px; height:auto;">
            </a>
        </figure>
        <div tabindex="0"
            class="block-editor-block-list__block wp-block has-small-font-size wp-block-post-date"
            id="block-5f8cf677-b422-427c-ac71-26aa0260ae82" role="document" aria-label="Block: Date"
            data-block="5f8cf677-b422-427c-ac71-26aa0260ae82" data-type="core/post-date" data-title="Date"
            style="font-size: clamp(var(--wp--custom--typography--small-min), calc(var(--wp--custom--typography--fluid-size) / var(--wp--custom--typography--scale)), var(--wp--custom--typography--small-max));">
            <time datetime="{{date}}">{{date}}</time>
        </div>
        <h3 tabindex="0" class="block-editor-block-list__block wp-block wp-block-post-title"
            id="block-cd068980-6d63-440c-9cd3-8fa6cb250269" role="document" aria-label="Block: Title"
            data-block="cd068980-6d63-440c-9cd3-8fa6cb250269" data-type="core/post-title"
            data-title="Title">
            <a href="{{home_url}}{{path}}" target="_self">{{title}}</a>
        </h3>
    </li>`;
	
	const fusejs_options = {
		// isCaseSensitive: false,
		includeScore: true,
		shouldSort: true,
		// includeMatches: false,
		findAllMatches: true,
		// minMatchCharLength: 1,
		// location: 0,
		threshold: 0.55,
		// distance: 100,
		useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		keys: [
			'title',
			'excerpt',
			'content'
		]
	};

	let fuse;
	let index;

	get_index();

	/**
	 * Get the index.
	 */
	function get_index() {

		var request = new XMLHttpRequest();
		request.open(
			'GET',
			'/search.json',
			true
		);

		request.setRequestHeader( 'Content-type', 'application/json' );
		request.onreadystatechange = function() {
			if ( request.readyState == 4 && request.status == 200 ) {
				index = JSON.parse( request.responseText );

				// If on search page, then run search.
				if ( null !== get_search_param() ) {
					show_search_page();
				}

			}
		};

		request.send();
	}

	/**
	 * Display results on the page.
	 */
	function show_results( wrapper_template, content, results, template ) {

		let page_content = '';
		for ( let i = 0; i < results.length; i++ ) {
			let result = [];

			result.id            = results[ i ]['id'];
			result.slug          = results[ i ]['slug'];
			result.path          = results[ i ]['path'];
			result.title         = results[ i ]['title'];
			result.excerpt       = results[ i ]['excerpt'];
			result.content       = results[ i ]['content'];
			result.date          = date( index.date_format, results[ i ]['timestamp'] );
			result.modified_date = results[ i ]['modified_timestamp'];
			result.term_ids      = results[ i ]['term_ids'];
			result.hero_image    = results[ i ]['hero_image']; 

			// Authors.
			let author_id              = results[ i ]['author_id'];
			result.author_id           = author_id;
			authors_list               = JSON.parse( index.authors );
			result.author              = authors_list[ author_id ];
			result.author.display_name = result.author.display_name;

			page_content = page_content + Mustache.render( template, result );
		}
		page_content = `<div class="block-editor-block-list__block wp-block alignwide wp-block-query block-editor-block-list__layout is-layout-flow wp-block-query-is-layout-flow">${page_content}</div>`;

		let rendered_content = wrapper_template.replace( '{{main_content}}', page_content );
		content.innerHTML = rendered_content;
	}

	/**
	 * Get the search parameter.
	 */
	function get_search_param() {
		const url_params   = new URLSearchParams( window.location.search );
		return url_params.get( 's' );
	}

	/**
	 * Show the search page and run query.
	 */
	function show_search_page() {

		fuse = new Fuse( index.posts, fusejs_options );
	
		// Get results.
		let fuse_results = fuse.search( get_search_param() );
	
		let results = [];
		let i;
		for ( i = 0; i < fuse_results.length; i++ ) {
			results[ i ] = fuse_results[ i ]['item'];
		}
	
		// Set whether there is a plural number of results.
		let plural = '';
		if ( i !== 1 ) {
			plural = 's';
		}
	
		let search_template  = `
			<header class="page-header alignwide">
				<h1 class="page-title">
					Results for &quot;<span class="page-description search-term">` + get_search_param() + `</span>&quot;     </h1>
			</header><!-- .page-header -->

			<div class="search-result-count default-max-width">
				We found ` + i + ` result` + plural + ` for your search.
			</div><!-- .search-result-count -->

			<div class="results-container">
				{{main_content}}
			</div>`;
	
		// Get the content element
		let content = document.getElementById('wp--skip-link--target');
	
		// Check if content is not null before calling show_results
		if (content !== null) {
			show_results( search_template, content, results, excerpt_template );
		} else {
			console.error('Content element not found');
		}
	}
});
