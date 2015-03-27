# My Résumé

This is, literally, an online résumé. An HTML, directly printable, responsive résumé of a previous version I typed and styled in Microsoft Word.

Oh, and by the way, [do hire me](mailto:ohai@diagramatics.me)!

## HTML?

This résumé is made using HTML, CSS with Sass as the preprocessor and Autoprefixer to handle the pesky vendor prefixes, and slight JavaScript for more interaction.

## Printable?

Of course everything is printable, but this résumé takes it even further by making it printer-friendly. The résumé is optimized to not put any page breaks between important content and the content itself has been optimized and constantly rewritten to fit as nice as possible in an A4 and Legal paper size, two of the most used paper sizes for recruiters.

More optimizations can be done for page headers and footers, but this would need [CSS Paged Media Module Level 3](http://dev.w3.org/csswg/css-page-3/) to be implemented on major browsers (which is very, very limited, sadly).

## Responsive?

Unlike normal Word-made résumés, this resume is responsive so it can be printed on any paper size you can think of, not just the conventional A-sizes and US-sizes papers. The CSS `page-break-inside` helps with this a lot to prevent any page breaks between the content of each sections.
