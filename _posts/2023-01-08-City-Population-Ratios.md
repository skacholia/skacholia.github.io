---
published: true
layout: post
---
Atlanta has a population of only 496,461 — smaller than cities like Fresno, Kansas City, and Milwaukee. Miami, Florida is even smaller than Atlanta, with a population of only 439,890, comparable to Virginia Beach and Raleigh 

Given the cultural and economic prominence of these cities, their small populations might prove surprising. But when using a slightly different metric — metro population — these cities balloon in size. Atlanta has a metro population of 6.144 million, the 9th largest in the US. Miami is close behind, with a metro population of 6.091 million.

[**Metro population**](https://www.census.gov/programs-surveys/metro-micro.html) is used by the U.S. Census Bureau to estimate a city’s size including both the **city proper** and **suburban populations**. This metric reflects how someone living in, for example, Burbank, is still part of the larger Los Angeles area. To calculate metro populations, the Census Bureau usually uses **county populations**.

Given the wide discrepancy between the metro and within-city populations for places like Atlanta and Miami, I wanted to see how these two metrics compare for _all_ cities in the US. Besides just being interesting, I thought this could provide a rough measure of suburbanization for cities (but not a perfect measure, for reasons I’ll explain later). 

I used R for analysis, and used the following code to obtain data:

    library(ggplot2)
    library(ggthemes)
    library(tidyverse)
    library(tidycensus)
    library(forcats)
    
    metro <- get_acs(geography = 
		"metropolitan statistical area/micropolitan statistical area",
	    variables = "B01003_001E",
	    year = 2020)
    
    cities <- read_csv("cities.csv")


I use the [tidycensus](https://walker-data.com/tidycensus/) package for metro populations, and a [Census dataset](https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html) for city populations. 

Next, I do some basic data cleaning and make a dataframe combining both populations. I only use the top 100 cities by population, to exclude cities sharing names with smaller towns and simplify the analysis. I make a ratio column, defined as metro population / city population.

    cities <- subset(cities, grepl("city$", NAME))
    cities <- cities %>%
      select(NAME, POPESTIMATE2020) %>%
      arrange(desc(POPESTIMATE2020))
    cities <- cities[!duplicated(cities$NAME),]
    cities$NAME <- sub(" city", "\\1", cities$NAME)
    
    metro <- metro %>%
      arrange(desc(estimate)) %>% 
      select(NAME, estimate)
    metro$NAME <- sub("^([^-]*).*", "\\1", metro$NAME)
    metro$NAME <- sub("^([^,]*).*", "\\1", metro$NAME)
    
    cities <- head(cities, 100)
    metro <- head(metro, 100)
    
    combined <- merge(cities, metro, by.x = "NAME", by.y = "NAME") %>%
      arrange(desc(estimate))
    
    combined <- rename(combined, city = POPESTIMATE2020)
    combined <- rename(combined, metro = estimate)
    combined <- combined %>% 
      mutate(ratio = metro / city) %>% 
      arrange(desc(ratio))
Then, I plot the results: 

    cities <- subset(cities, grepl("city$", NAME))
    cities <- cities %>%
      select(NAME, POPESTIMATE2020) %>%
      arrange(desc(POPESTIMATE2020))
    cities <- cities[!duplicated(cities$NAME),]
    cities$NAME <- sub(" city", "\\1", cities$NAME)
    
    metro <- metro %>%
      arrange(desc(estimate)) %>% 
      select(NAME, estimate)
    metro$NAME <- sub("^([^-]*).*", "\\1", metro$NAME)
    metro$NAME <- sub("^([^,]*).*", "\\1", metro$NAME)
    
    cities <- head(cities, 100)
    metro <- head(metro, 100)
    
    combined <- merge(cities, metro, by.x = "NAME", by.y = "NAME") %>%
      arrange(desc(estimate))
    
    combined <- rename(combined, city = POPESTIMATE2020)
    combined <- rename(combined, metro = estimate)
    combined <- combined %>% 
      mutate(ratio = metro / city) %>% 
      arrange(desc(ratio))

I chose to look at the top 20 and bottom 20 by ratio, yielding the following graphs:

![ratio.png](_posts/ratio.png)
![ratiobottom20.png](_posts/ratiobottom20.png)

As expected, Miami and Atlanta are near the top, with ratios of around 14 and 12, respectively. But bigger than both is Riverside, California. The reason why also explains why this ratio isn't a completely ideal metric for measuring suburbanization. As mentioned previously, the Census Bureau uses counties to measure metro population. Counties in the Western US are usually larger and more scarce than those in the East (Arizona, for example, only has 15 counties, compared to Georgia's 159). This is exemplified by the Riverside–San Bernardino–Ontario metro area, which only consists of two counties. These counties, however, are huge:

![inland-empire-map.jpeg](_posts/inland-empire-map.jpeg)

Of course, a metro area that large will contain a large amount of people compared to the small city of Riverside. Thus, the ratio is heavily confounded by how big counties are.

I think tweaking the ratio, maybe by accounting for size of metro area, could still provide a decent, if rough, measure of suburbanization in the US. As far as I can tell, this doesn not currently exist in any easily accessible way. That might the subject of a future post, however.

Thank you for reading! Here is the full graph of ratios:

![full.png](_posts/full.png)



