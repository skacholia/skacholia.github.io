---
published: true
layout: post
---
Atlanta has a population of only 496,461 — smaller than cities like Fresno, Kansas City, and Milwaukee. Miami, Florida is even smaller than Atlanta, with a population of only 439,890, comparable to Virginia Beach and Raleigh 

Given the cultural and economic prominence of these cities, their small populations might prove surprising. But when using a slightly different metric — metro population — these cities balloon in size. Atlanta has a metro population of 6.144 million, the 9th largest in the US. Miami is close behind, with a metro population of 6.091 million.

**Metro population** is used by the U.S. Census Bureau to estimate a city’s size including both the **city proper** and **suburban populations**. This metric reflects how someone living in, for example, Burbank, is still part of the larger Los Angeles area. To calculate metro populations, the Census Bureau usually uses **county populations**.

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


I use the tidycensus package for metro populations, and a Census dataset for city populations. 

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

![ratio](/skacholia.github.io/assets/ratio.png)
![ratio2](/skacholia.github.io/assets/ratio2.png)


