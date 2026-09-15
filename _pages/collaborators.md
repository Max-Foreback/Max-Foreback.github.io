---
title: "Collaborators"
permalink: /collaborators/
redirect_from:
  - /colab
---

<p class="lede">I work with some pretty great people, here are a few:</p>

<ul class="card-grid">
{% for collaborator in site.data.collaborators %}
  <li class="card">
    <img src="{{ '/images/' | append: collaborator.picture | relative_url }}" alt="{{ collaborator.name }}">
    <h3><a href="{{ collaborator.link }}">{{ collaborator.name }}</a></h3>
    <p>{{ collaborator.description }}</p>
  </li>
{% endfor %}
</ul>
