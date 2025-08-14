import {
  Box,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchEvents } from "../api/events";
import EventCard from "../components/EventCard";
import AddEventModal from "../components/AddEventModal";
import { useAppContext } from "../context/AppContext";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const { categories } = useAppContext();

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Map category ID to name for easy lookup
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  // Filter events based on search and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (event.categoryIds &&
        event.categoryIds.map(String).includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  // Build unique categories list for select dropdown, including "all"
  const uniqueCategoryIds = [
    ...new Set(events.flatMap((e) => e.categoryIds || [])),
  ];
  const uniqueCategories = [
    { id: "all", name: "All Categories" },
    ...uniqueCategoryIds.map((id) => ({
      id,
      name: categoryMap[id] || "Unknown",
    })),
  ];

  return (
    <Box p={6}>
      <Heading mb={4}>All Events</Heading>

      <Box display="flex" gap={4} mb={6} flexWrap="wrap">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width={{ base: "100%", md: "auto" }}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          width="200px"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <AddEventModal onEventAdded={loadEvents} categories={categories} />
      </Box>

      {loading ? (
        <Spinner size="xl" />
      ) : filteredEvents.length === 0 ? (
        <Text>No events found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {filteredEvents.map((event) => (
            <Box key={event.id} height="300px">
              <EventCard event={event} categories={categories} />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
