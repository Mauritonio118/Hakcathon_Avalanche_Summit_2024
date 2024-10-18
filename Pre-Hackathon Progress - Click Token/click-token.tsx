'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowDownIcon } from '@radix-ui/react-icons'

type Upgrade = {
  name: string;
  cost: number;
  cps: number;
}

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function ClickToken() {
  const [followers, setFollowers] = useState(0)
  const [clickTokens, setClickTokens] = useState(0)
  const [cps, setCps] = useState(0)
  const [clickValue, setClickValue] = useState<{ value: number, x: number, y: number } | null>(null)
  const [shake, setShake] = useState(false)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { name: "Post Upload", cost: 10, cps: 0.1 },
    { name: "Trending on Social Media", cost: 100, cps: 1 },
    { name: "Collaboration with Celebrities", cost: 1000, cps: 10 },
    { name: "Brand Ambassador", cost: 5000, cps: 50 },
    { name: "Opinion Leader", cost: 10000, cps: 100 },
    { name: "Column in National Newspaper", cost: 50000, cps: 500 },
    { name: "International Speaker", cost: 100000, cps: 1000 },
    { name: "Magazine Cover", cost: 500000, cps: 5000 },
    { name: "Advisor to Major Companies", cost: 1000000, cps: 10000 },
    { name: "Global Icon", cost: 5000000, cps: 50000 },
  ])
  const [activeTab, setActiveTab] = useState<'swap' | 'mint'>('swap')
  const [sellToken, setSellToken] = useState('ETH')
  const [buyToken, setBuyToken] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setFollowers(prevFollowers => prevFollowers + cps)
    }, 1000)
    return () => clearInterval(timer)
  }, [cps])

  useEffect(() => {
    const initialBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 50 + 10,
      speed: Math.random() * 0.5 + 0.1
    }))
    setBubbles(initialBubbles)

    const moveBubbles = setInterval(() => {
      setBubbles(prevBubbles => prevBubbles.map(bubble => ({
        ...bubble,
        y: (bubble.y - bubble.speed + 100) % 100
      })))
    }, 50)

    return () => clearInterval(moveBubbles)
  }, [])

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setClickTokens(prevTokens => prevTokens + 1)
    setFollowers(prevFollowers => prevFollowers + 1)
    setClickValue({ value: 1, x, y })
    setShake(true)

    setTimeout(() => {
      setShake(false)
    }, 300)
  }, [])

  const buyUpgrade = useCallback((upgrade: Upgrade) => {
    if (followers >= upgrade.cost) {
      setFollowers(prevFollowers => prevFollowers - upgrade.cost)
      setCps(prevCps => prevCps + upgrade.cps)
      setUpgrades(prevUpgrades =>
        prevUpgrades.map(u =>
          u.name === upgrade.name ? { ...u, cost: Math.ceil(u.cost * 1.15) } : u
        )
      )
    }
  }, [followers])

  const handleSwap = () => {
    // Implementar lógica de swap aquí
    console.log(`Swap ${sellAmount} ${sellToken} to ${buyAmount} ${buyToken}`)
  }

  const handleMint = () => {
    // Implementar lógica de mint aquí
    console.log(`Mint ${clickTokens} CLICK`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <h1 className="text-6xl font-bold text-center mb-8 text-white" style={{ fontFamily: "'Bangers', cursive" }}>Click Token</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm col-span-1 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-2">Followers</h2>
                <motion.p 
                  className="text-6xl md:text-7xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500" 
                  aria-live="polite"
                  key={followers}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {Math.floor(followers)}
                </motion.p>
                <p className="text-xl mb-4" aria-live="polite">
                  {cps.toFixed(1)} per second
                </p>
                <h3 className="text-2xl font-semibold mb-2">Click Tokens</h3>
                <p className="text-3xl font-bold mb-4" aria-live="polite">
                  {clickTokens}
                </p>
                <div className="relative w-full max-w-xs">
                  <motion.div
                    animate={shake ? { x: [-2, 2, -2, 2, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Button 
                      onClick={handleClick} 
                      className="w-full text-2xl py-10 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300"
                      aria-label="Click to increase followers and click tokens"
                    >
                      ¡CLICK!
                    </Button>
                  </motion.div>
                  <AnimatePresence>
                    {clickValue && (
                      <motion.div
                        className="absolute text-2xl font-bold text-white"
                        style={{ left: clickValue.x, top: clickValue.y }}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        +{clickValue.value}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upgrades</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {upgrades.map((upgrade, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{upgrade.name}</span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => buyUpgrade(upgrade)}
                        disabled={followers < upgrade.cost}
                        className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ${followers >= upgrade.cost ? 'animate-pulse' : ''}`}
                        aria-label={`Buy ${upgrade.name} for ${upgrade.cost} followers`}
                      >
                        Buy ({upgrade.cost})
                      </Button>
                    </motion.div>
                  </div>
                  <Progress value={(followers / upgrade.cost) * 100} max={100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between">
                <Button 
                  onClick={() => setActiveTab('swap')}
                  className={`${activeTab === 'swap' ? 'bg-blue-500' : 'bg-gray-300'} text-white px-8 py-2`}
                >
                  Swap
                </Button>
                <Button 
                  onClick={() => setActiveTab('mint')}
                  className={`${activeTab === 'mint' ? 'bg-blue-500' : 'bg-gray-300'} text-white px-8 py-2`}
                >
                  Mint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'swap' ? (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sell</label>
                    <div className="flex justify-between items-center">
                      <Input 
                        type="number" 
                        value={sellAmount} 
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="text-2xl w-2/3"
                        placeholder="0"
                      />
                      <Select value={sellToken} onValueChange={setSellToken}>
                        <SelectTrigger className="w-1/3">
                          <SelectValue>{sellToken}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="CLICK">CLICK</SelectItem>
                          <SelectItem value="AVAX">AVAX</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowDownIcon className="w-6 h-6" />
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buy</label>
                    <div className="flex justify-between items-center">
                      <Input 
                        type="number" 
                        value={buyAmount} 
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="text-2xl w-2/3"
                        placeholder="0"
                      />
                      <Select value={buyToken} onValueChange={setBuyToken}>
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="CLICK">CLICK</SelectItem>
                          <SelectItem value="AVAX">AVAX</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleSwap} className="w-full bg-blue-500 text-white py-3 text-lg">SWAP</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Available Click Tokens: {clickTokens}</p>
                  <Button onClick={handleMint} className="w-full bg-blue-500 text-white">Mint CLICK</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
        />
      ))}
    </div>
  )
}