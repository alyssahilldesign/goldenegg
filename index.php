<?php get_header(); ?>

<div id="content">

	<div class="wrapInner">

		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<article <?php post_class( 'cf' ); ?>>

			<header class="article-header">
				<a class="h2" href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a>
				<p class="byline"><?php the_time('F j, Y'); ?> <?php the_category(', '); ?></p>
			</header>

			<section class="entry-content">
				<?php echo excerpt(20); //the_excerpt(); ?>
			</section>

		</article>

		<?php endwhile; 
			include(locate_template('components/pageNavi/pageNavi.php')); 
		else : 
			echo '<h1>Nothing Found Here</h1>';
		endif; ?>

	</div>

</div>

<?php get_footer(); ?>
