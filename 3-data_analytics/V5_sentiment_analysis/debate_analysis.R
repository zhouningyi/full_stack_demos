# Sentiment Analysis of the 2016 First President Debate  - TRUMP vs CLINTON

install.packages("tidyverse", "stringr")
install.packages("gridExtra", "ggrepel")
install.packages("tidytext")
install.packages("broom")
install.packages("scales")
install.packages("ggrepel")
install.packages("purrr")
install.packages("tidyr")
install.packages("ggbeeswarm")

library(dplyr)
library(tidyverse)
library(stringr)
library(ggplot2)
library(ggrepel)
library(purrr)
library(ggbeeswarm)
library(gridExtra)
library(ggrepel)
library(tidyr)
library(tidytext)
library(broom) 
library(scales)

# read in the transcript
# data source:
# https://www.washingtonpost.com/news/the-fix/wp/2016/09/26/the-first-trump-clinton-presidential-debate-transcript-annotated/
setwd("~/Desktop/data_analytics/data_analytics/V5_sentiment_analysis")
xx <- scan("first_debate.txt", "character")

# split by speaker 
ind <- grep("TRUMP:|CLINTON:|HOLT:", xx)
by_speaker <- vector("list", length(ind))
for(i in seq_along(ind)){
  j <- ifelse(i == 0, 0, ifelse(i == length(ind), i-1, i+1))
  by_speaker[[i]] <- xx[ind[i]:(ind[j] - 1)]
}

# make speaker's name the list element name
names(by_speaker) <- 
  map(by_speaker, `[[`, 1) %>% 
  gsub(":", "", .)

# remove speakers name from spoken text
by_speaker <- 
  map(by_speaker, ~gsub("TRUMP:|CLINTON:|HOLT:", "", .)) %>% 
  map(., ~.x[.x != ""])

# remove Holt's turns
candidates_words <- by_speaker[!names(by_speaker) == "HOLT"]

# who had the most turns to speak?
table(names(candidates_words))

# who said the most words?
# words per turn?

candidates_words_df <- 
  candidates_words %>% 
  map(., ~length(.)) %>% 
  stack()

most_words <- 
  candidates_words_df %>% 
  group_by(ind) %>% 
  summarize(total_words_spoken_in_event = sum(values), 
            number_of_turns_to_speak = n()) %>% 
  gather(word_stat, value, -ind)

# plots
words_per_turn_plot <- 
  ggplot(candidates_words_df, 
         aes(ind, 
             values,
             colour = ind)) +
  geom_quasirandom(alpha = 0.5) +
  geom_point(aes(ind,
                 mean(values)),
             size = 5) +
  scale_y_log10() +
  ylab("Words per turn speaking") +
  xlab("") +
  scale_colour_discrete(name = "") +
  theme_bw()

most_words_plot <- 
  ggplot(most_words,
         aes(ind, 
             value,
             colour = ind)) +
  geom_point(size = 5) +
  facet_wrap(~word_stat, scales = "free_y") +
  xlab("") +
  scale_colour_discrete(name = "") +
  theme_bw()

grid.arrange(words_per_turn_plot, 
             most_words_plot,
             ncol = 1,
             top = "Summary of the word and turn counts in the debate")


# all of each candidate's words in one vector
hrc <- unname(unlist(candidates_words[names(candidates_words) == "CLINTON"]))
dt <- unname(unlist(candidates_words[names(candidates_words) == "TRUMP"]))
both <- c(hrc, dt)

# word counts
hrc_wc <- 
  as_data_frame(table(hrc)) %>% arrange(desc(n)) %>% rename(word = hrc)

dt_wc <- 
  as_data_frame(table(dt)) %>% arrange(desc(n)) %>% rename(word = dt)

both_wc <- 
  as_data_frame(table(both)) %>% arrange(desc(n)) %>% rename(word = both)

# combine both speakers, convert words to lower case and remove duplicate words and spaces
all_words <- 
  left_join(both_wc, hrc_wc, by = 'word') %>% 
  left_join(., dt_wc, by = 'word') %>% 
  rename(both = n.x, hrc = n.y, dt = n) %>% 
  mutate(word = gsub(" ", "", tolower(word))) %>% 
  group_by(word) %>% 
  slice(1)

# trumpiness and hilaryness, only for words they use at least five times

word_uniqueness <- 
  all_words %>% 
  filter(hrc > 5,
         dt > 5) %>% 
  mutate(trumpiness = log(dt/both),
         hilaryness = log(hrc/both))

# most Trumpy words
trumpy <- 
  word_uniqueness %>% 
  arrange(desc(trumpiness))

# most Hilaryness words
hilary <- 
  word_uniqueness %>% 
  arrange(desc(hilaryness))

# plot most extreme words
n <- 20
extreme_words <- 
  rbind(trumpy[1:n, ],
        hilary[1:n, ])
extreme_words$speaker <- c(rep("dt", n), rep("hrc", n))

ggplot(extreme_words,
       aes(trumpiness, 
           hilaryness)) +
  geom_text_repel(aes(label = word,
                      colour = speaker),
                  segment.color = NA) +
  guides(colour = 'none') +
  theme_bw() +
  ggtitle("Words that are most distinctive of the speaker")

# most common from DT v HRC
# method from David Robinson's excellent post on Trump's tweets, at http://varianceexplained.org/r/trump-tweets/
logratios <- 
  all_words %>% 
  filter(hrc > 5,
         dt > 5) %>% 
  map_if(is.integer, as.double) %>%
  as_data_frame() %>% 
  mutate_each(funs((. + 1) / sum(. + 1)), -word) %>%
  mutate(logratio = log2(hrc / dt)) %>%
  arrange(desc(logratio))

# plot them
logratios %>% 
  filter(logratio > 1 |
           logratio < -1) %>% 
  ggplot(., aes(reorder(word, logratio),
                logratio)) +
  geom_bar(stat = "identity") +
  coord_flip()
# same as 'extreme words plot'

# sentiment analysis, also from David Robinson's wonderful work
# and using the tidytext package from Julia Silge

nrc <- sentiments %>%
  filter(lexicon == "nrc") %>%
  dplyr::select(word, sentiment)

sentiment_counts <- 
  all_words %>% 
  gather(speaker,  n, -word) %>% 
  group_by(speaker) %>% 
  mutate(total_words = sum(n, na.rm = TRUE)) %>% 
  left_join(nrc) %>% 
  filter(speaker != 'both') %>% 
  group_by(sentiment, speaker, total_words) %>% 
  summarise(sentiment_words = sum(n, na.rm = TRUE))

sentiment_differences <- 
  sentiment_counts %>%
  group_by(sentiment) %>%
  do(tidy(poisson.test(.$sentiment_words, .$total_words))) %>% 
  filter(!is.na(sentiment))


sentiment_differences %>%
  ungroup() %>%
  mutate(sentiment = reorder(sentiment, estimate)) %>%
  mutate_each(funs(. - 1), estimate, conf.low, conf.high) %>%
  ggplot(aes(estimate, sentiment)) +
  geom_point(aes(colour = estimate < 0)) +
  geom_errorbarh(aes(xmin = conf.low, 
                     xmax = conf.high,
                     colour = estimate < 0)) +
  scale_x_continuous(labels = percent_format()) +
  guides(colour = "none") +
  labs(x = "% increase in DT relative to HRC",
       y = "Sentiment") +
  theme_bw() +
  ggtitle("Differences in sentiments implied \nby the words of each speaker")

# refer to: https://github.com/benmarwick