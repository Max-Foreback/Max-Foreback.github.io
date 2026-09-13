source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

# The github-pages gem pins an old Jekyll built for an older Ruby than what's
# installed here (its stdlib assumptions break on newer Rubies). GitHub's
# actual Pages build uses its own fixed toolchain server-side regardless of
# this Gemfile, so local dev just uses current Jekyll directly instead.
# gem "github-pages", group: :jekyll_plugins
gem "jekyll"

# wdm speeds up file-watching on Windows, but its native extension doesn't
# build on newer Ruby versions; Jekyll/listen fall back to polling without it.
# gem "wdm", "~> 0.1.0" if Gem.win_platform?

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "webrick", "~> 1.8"
end

# hawkins (browser auto-reload) pins Jekyll < 4 and was dragging in a much
# older Jekyll than needed; dropped for now. `jekyll serve` still rebuilds
# on save, just without auto-refreshing the browser tab.
# gem "hawkins"
