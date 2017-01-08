ATED_FILES = \
	world.json

all: $(GENERATED_FILES)

clean:
	rm -rf -- %(GENERATED_FILES)

.PHONY: all clean

build/ne_50m_admin_0_countries.zip:
	mkdir -p $(dir $@)
	curl -o $@ 'http://www.nacis.org/naturalearth/50m/cultural/$(notdir $@)'

build/ne_50m_admin_0_countries.shp: build/ne_50m_admin_0_countries.zip
	unzip -d $(dir $@) $<
	touch $@

world.json: build/ne_50m_admin_0_countries.shp sphere.json
	node_modules/.bin/topojson \
		-q 1e5 \
		--projection='width = 960, height = 960, d3.geo.mercator() \
				.translate([width / 2, height / 2]) \
				.scale((width - 1) / 2 / Math.PI)' \
		-- \
		countries=build/ne_50m_admin_0_countries.shp \
		sphere=sphere.json | \
			node_modules/.bin/topojson-merge \
				--io countries \
				--oo land \
				-o $@
