---
title: "Publications"
permalink: /publications/
description: "Publications by Max Foreback on evolutionary computation, evolved antenna and spacecraft design (Nebulous, NASA JPL), and evolutionary swarm robotics."
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
    {% if pub.authors %}<p class="pub-authors">{{ pub.authors }}</p>{% endif %}
  </li>
{% endfor %}
</ul>
