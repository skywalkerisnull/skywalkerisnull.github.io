document.addEventListener("DOMContentLoaded", function() {
    const content = document.getElementById( 'main' );

	const excerpt_template = `
    <li class="wp-block-post post-{{id}} page type-page status-publish format-standard has-post-thumbnail hentry category-it-management category-professional category-software-engineering tag-development tag-management tag-roles tag-software">
        <figure class="wp-block-post-featured-image">
            <a href="{{home_url}}{{path}}" target="_self">
                <img width="150" height="150" src="{{hero_image}}" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="{{title}}" style="object-fit:cover;" decoding="async" fetchpriority="high" sizes="(max-width: 150px) 100vw, 150px">
            </a>
        </figure>

        <div class="wp-block-post-date has-small-font-size">
            <time datetime="{{date}}">{{date}}</time>
        </div>

        <h3 class="wp-block-post-title">
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
	
		{{main_content}}`;
	
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
