---
layout: archive
title: "Seelcted Awards"
permalink: /awards/
author_profile: true
---

{% include base_path %}
&nbsp;

<style>
  .award-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .award {
    width: 45%;
    max-width: 400px;
    box-sizing: border-box;
    margin: 15px;
    text-align: center;
  }
  .award img {
    width: 150px;
    height: auto;
    object-fit: contain;
  }
  .award h2 {
    margin: 10px 0 5px;
  }
  .award p {
    margin: 0;
  }
</style>

<div class="award-container">
  {% for award in site.data.awards %}
  <div class="award">
    <img src="{{ site.baseurl }}/images/{{ award.image }}" alt="{{ award.organization }}">
    <h2>{{ award.name }}</h2>
    <p><strong>Granting Organization:<br></strong> {{ award.organization }}</p>
    <p><strong>Stipend Amount:</strong> {{ award.stipend_amount }}</p>
    
    {% if award.tuition_waiver_amount %}
      <p><strong>Tuition Waiver Amount:</strong> {{ award.tuition_waiver_amount }}</p>
    {% endif %}
    {% if award.duration %}
      <p><strong>Duration:</strong> {{ award.duration }}</p>
    {% endif %}
  </div>
  {% endfor %}
</div>
