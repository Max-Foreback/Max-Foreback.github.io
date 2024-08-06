---
layout: archive
title: ""
permalink: /collaborators/
author_profile: true
redirect_from:
  - /colab
---

{% include base_path %}

Here are some of the great people I work with
======
&nbsp;
<style>
  .collaborator-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .collaborator {
    flex: 1 0 30%;
    box-sizing: border-box;
    margin-bottom: 20px;
    text-align: center;
  }
  .collaborator img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
  }
  .collaborator h2 {
    margin: 10px 0 5px;
  }
  .collaborator p {
    margin: 0;
  }
</style>

<div class="collaborator-container">
  {% for collaborator in site.data.collaborators %}
  <div class="collaborator">
    <img src="{{ site.baseurl }}/images/{{ collaborator.picture }}" alt="{{ collaborator.name }}">
    <h2><a href="{{ collaborator.link }}">{{ collaborator.name }}</a></h2>
    <p>{{ collaborator.description }}</p>
  </div>
  {% endfor %}
</div>
