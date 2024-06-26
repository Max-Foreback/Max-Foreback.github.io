---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  You can find the most up to date list of my publications on [My Google Scholar Profile](https://scholar.google.com/citations?user=AcTEViAAAAAJ&hl=en).
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
