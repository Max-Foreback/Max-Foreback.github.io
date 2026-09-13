---
title: "Selected Awards"
permalink: /awards/
---

<ul class="card-grid">
{% for award in site.data.awards %}
  <li class="card">
    <img class="card-img--contain" src="{{ '/images/' | append: award.image | relative_url }}" alt="{{ award.organization }}">
    <h3>{{ award.name }}</h3>
    <p><strong>Granting organization:</strong> {{ award.organization }}</p>
    <p><strong>Stipend amount:</strong> {{ award.stipend_amount }}</p>
    {% if award.tuition_waiver_amount %}<p><strong>Tuition waiver amount:</strong> {{ award.tuition_waiver_amount }}</p>{% endif %}
    {% if award.duration %}<p><strong>Duration:</strong> {{ award.duration }}</p>{% endif %}
  </li>
{% endfor %}
</ul>
