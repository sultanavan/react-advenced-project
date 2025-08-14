import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { addEvent } from "../api/events";

const AddEventModal = ({ onEventAdded, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    const newEvent = {
      ...form,
      categoryIds: form.categoryIds, // array of selected category ids
    };
    await addEvent(newEvent);
    onEventAdded();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal">
        Add Event
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup
                value={form.categoryIds}
                onChange={(values) =>
                  setForm({ ...form, categoryIds: values.map(Number) })
                }
              >
                <Stack spacing={2}>
                  {categories.map((cat) => (
                    <Checkbox key={cat.id} value={cat.id}>
                      {cat.name}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEventModal;
