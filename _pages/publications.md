---
title: "Publications"
permalink: /publications/
---

{% if site.author.googlescholar %}
<p class="lede">You can find the most up to date list of my publications on my <a href="{{ site.author.googlescholar }}">Google Scholar profile</a>.</p>
{% endif %}

<ul class="pub-list">
{% for pub in site.data.publications %}
  <li>
    <span class="pub-title">
      {% if pub.url %}<a href="{{ pub.url }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
    </span>
    <span class="pub-meta">{{ pub.venue }} &middot; {{ pub.date }}</span>
    {% if pub.excerpt %}<p class="pub-excerpt">{{ pub.excerpt }}</p>{% endif %}
  </li>
{% endfor %}
</ul>
