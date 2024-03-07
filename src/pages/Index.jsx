import React, { useState } from "react";
import { ChakraProvider, Box, Text, Button, VStack, HStack, Input, InputGroup, InputRightElement, List, ListItem, IconButton, Heading, Container, Divider, OrderedList, ListItemProps, extendTheme } from "@chakra-ui/react";
import { FaCheck, FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100",
      },
    },
  },
});

const initialValues = ["Honesty", "Integrity", "Responsibility", "Respect", "Courage", "Compassion", "Fairness", "Equality", "Freedom", "Peace", "Love", "Wisdom", "Humility", "Sympathy", "Empathy", "Spirituality", "Trustworthiness", "Loyalty", "Gratitude", "Generosity"];

const Index = () => {
  const [stage, setStage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);
  const [results, setResults] = useState({});

  const filteredValues = initialValues.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleValueSelection = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < 10) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const startComparisons = () => {
    const matchups = [];
    const selected = [...selectedValues];
    while (selected.length) {
      const value = selected.pop();
      selected.forEach((otherValue) => {
        matchups.push([value, otherValue]);
      });
    }
    setMatchups(matchups);
    setStage(3);
  };

  const handleComparison = (winner, loser) => {
    setResults({
      ...results,
      [winner]: (results[winner] || 0) + 1,
    });
    if (currentMatchupIndex < matchups.length - 1) {
      setCurrentMatchupIndex(currentMatchupIndex + 1);
    } else {
      setStage(4);
    }
  };

  const getRankingList = () => {
    return Object.entries(results)
      .sort((a, b) => b[1] - a[1])
      .map(([value], index) => (
        <ListItem key={value} mb={2}>
          {index + 1}. {value}
        </ListItem>
      ));
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={10}>
        {stage === 1 && (
          <VStack spacing={6} alignItems="flex-start">
            <Heading>Welcome to Value Rater!</Heading>
            <Text>Discover and prioritize your values with a simple and engaging process.</Text>
            <Button rightIcon={<FaArrowRight />} colorScheme="teal" onClick={() => setStage(2)}>
              Start Rating
            </Button>
          </VStack>
        )}
        {stage === 2 && (
          <VStack spacing={4} alignItems="stretch">
            <Heading>Select Your Top 10 Values</Heading>
            <InputGroup>
              <Input placeholder="Search values..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <InputRightElement children={<FaSearch />} />
            </InputGroup>
            <List spacing={2}>
              {filteredValues.map((value) => (
                <ListItem key={value}>
                  <Button isFullWidth justifyContent="space-between" variant={selectedValues.includes(value) ? "solid" : "outline"} onClick={() => handleValueSelection(value)}>
                    {value}
                    {selectedValues.includes(value) && <FaCheck />}
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button rightIcon={<FaArrowRight />} colorScheme="teal" isDisabled={selectedValues.length !== 10} onClick={startComparisons}>
              Compare Values
            </Button>
          </VStack>
        )}
        {stage === 3 && (
          <VStack spacing={6}>
            <Heading>Compare Values</Heading>
            <Text>Choose the value that resonates more with you in each pair.</Text>
            <HStack justifyContent="space-between" width="100%">
              <Button colorScheme="blue" onClick={() => handleComparison(matchups[currentMatchupIndex][0], matchups[currentMatchupIndex][1])}>
                {matchups[currentMatchupIndex][0]}
              </Button>
              <Text>VS</Text>
              <Button colorScheme="blue" onClick={() => handleComparison(matchups[currentMatchupIndex][1], matchups[currentMatchupIndex][0])}>
                {matchups[currentMatchupIndex][1]}
              </Button>
            </HStack>
            <Button leftIcon={<FaArrowLeft />} colorScheme="gray" variant="outline" onClick={() => setStage(2)}>
              Back to Selection
            </Button>
          </VStack>
        )}
        {stage === 4 && (
          <VStack spacing={4} alignItems="stretch">
            <Heading>Your Value Ranking</Heading>
            {getRankingList().length > 0 ? <OrderedList>{getRankingList()}</OrderedList> : <Text>No values were compared.</Text>}
            <Button leftIcon={<FaArrowLeft />} colorScheme="gray" variant="outline" onClick={() => setStage(1)}>
              Start Over
            </Button>
          </VStack>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default Index;
