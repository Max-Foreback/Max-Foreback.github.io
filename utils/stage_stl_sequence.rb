#!/usr/bin/env ruby
# Stage a sequence of numbered STL frames (e.g. one evolved individual per
# generation) into assets/models/<name>/ for the site's Three.js viewer
# (assets/js/stl-viewer.js) to load.
#
# Input: a directory of files matching <number>_mesh.stl (any prefix works
# as long as a number appears before "_mesh.stl" — that number is the frame's
# sort order, e.g. generation number). A zip of such files also works; it's
# extracted to a temp directory first.
#
# Output: assets/models/<name>/frame-0001.stl, frame-0002.stl, ... (renumbered
# contiguously from 1, zero-padded so lexicographic sort == numeric sort) plus
# a manifest.json the viewer reads: {"count": N, "pattern": "frame-%04d.stl"}.
#
# Usage:
#   ruby utils/stage_stl_sequence.rb <source_dir_or_zip> <name>
#   ruby utils/stage_stl_sequence.rb stls.zip eclipse-run
#
# Re-run with a new <name> for each new evolutionary run/design you want to
# add a viewer for — nothing here is specific to this one dataset.

require "fileutils"
require "json"
require "tmpdir"

source, name = ARGV
if source.nil? || name.nil?
  warn "Usage: ruby utils/stage_stl_sequence.rb <source_dir_or_zip> <name>"
  exit 1
end

repo_root = File.expand_path("..", __dir__)
dest_dir = File.join(repo_root, "assets", "models", name)

working_dir = source
tmp_extract_dir = nil

if File.file?(source) && source.downcase.end_with?(".zip")
  tmp_extract_dir = File.join(Dir.tmpdir, "stl_stage_#{Process.pid}")
  FileUtils.mkdir_p(tmp_extract_dir)
  system("unzip", "-q", "-o", source, "-d", tmp_extract_dir) || abort("unzip failed")
  working_dir = tmp_extract_dir
end

stl_files = Dir.glob(File.join(working_dir, "**", "*.stl"), File::FNM_CASEFOLD)
abort("No .stl files found under #{working_dir}") if stl_files.empty?

# Sort numerically by the number preceding "_mesh.stl" (falls back to any
# leading number in the filename if that suffix isn't present).
numbered = stl_files.map do |path|
  base = File.basename(path)
  match = base.match(/(\d+)_mesh\.stl\z/i) || base.match(/(\d+)/)
  abort("Could not find a frame number in filename: #{base}") unless match
  [match[1].to_i, path]
end.sort_by(&:first)

FileUtils.rm_rf(dest_dir)
FileUtils.mkdir_p(dest_dir)

numbered.each_with_index do |(_original_number, path), index|
  frame_name = format("frame-%04d.stl", index + 1)
  FileUtils.cp(path, File.join(dest_dir, frame_name))
end

manifest = { "count" => numbered.size, "pattern" => "frame-%04d.stl" }
File.write(File.join(dest_dir, "manifest.json"), JSON.pretty_generate(manifest))

FileUtils.rm_rf(tmp_extract_dir) if tmp_extract_dir

puts "Staged #{numbered.size} frames into assets/models/#{name}/"
puts "Reference it from a page with: <div class=\"stl-viewer\" data-model=\"/assets/models/#{name}/\"></div>"
