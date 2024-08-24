'use client'
import { useState } from 'react'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box, Button, Stack, TextField, Typography, Card, CardContent, CardMedia, Grid, Link } from '@mui/material';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      // Ensure res.body is not null
      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      const processText = async ({ done, value }: { done: boolean, value?: Uint8Array }): Promise<string> => {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      }

      await reader.read().then(processText)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      <Header />
      <Box
        width="100vw"
        height="100%"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
          backdropFilter: 'blur(10px)', // Adds a glass-like effect
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          borderRadius: '10px', // Optional: rounded corners
        }}
      >
        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid rgba(0, 0, 0, 0.5)"
          p={2}
          spacing={3}

        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? '#150e43'
                      : '#d4d4e7'
                  }
                  color={
                    message.role === 'assistant'
                    ? 'white'
                    : '#150e43'
                  }
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'column'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" sx={{
              bgcolor: '#150e43', // No background color
              color: 'white', // Text color for contrast
              p: 1,
              border: '2px solid transparent', // Border to set the space for the glow
              boxShadow: `0 0 10px 4px rgba(21, 14, 67, 0.7)`, // Glowing effect
              ":hover":{boxShadow: `0 0 10px 4px rgba(21, 14, 67, 0.7)`,bgcolor: 'transparent',color:"#150e43"}
              
            }} onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>

        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid black"
          p={2}
          spacing={3}
          sx={{
            border: '1px solid black',
            color: '#150e43',
            display: { xs: 'none', md: 'flex' }, // Hidden on small screens, visible on medium and above
          }}
        >

          {/* Heading and Subheading */}
          <Typography variant="h3" align="center">
            <b>Proflens</b>
          </Typography>
          <Typography variant="subtitle1" align="center">
            Empowering Students with Research-Based Professor Ratings to Enhance Academic Decisions and Foster a Quality Learning Environment.</Typography>
          {/* Two Image Cards Side by Side */}
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: 'transparent', // No background color
                  color: '#150e43', // Text color for contrast
                  p: 1.5,
                  border: '2px solid transparent',
                  boxShadow: `0 0 10px 4px #150e43`,
                }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/owner1.png" // Replace with actual image path
                  alt="Owner 1"

                />
                <CardContent>
                  <Typography variant="h6">Hamza S.</Typography>
                  <Link href="https://www.linkedin.com/in/mdothamza" color="inherit" target="_blank" rel="noopener">
                    Linkedin
                  </Link>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: 'transparent', // No background color
                  color: '#150e43', // Text color for contrast
                  p: 1.5,
                  border: '2px solid transparent',
                  boxShadow: `0 0 10px 4px #150e43`,
                }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="/owner2.jpg" // Replace with actual image path
                  alt="Owner 2"
                />
                <CardContent>
                  <Typography variant="h6">Subhan Q.</Typography>
                  <Link href="https://www.linkedin.com/in/subhan-qamar/965946282" color="inherit" target="_blank" rel="noopener">
                  LinkedIn
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
      <Footer />

    </>
  )
}
