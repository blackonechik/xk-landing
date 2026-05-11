import { useNavigate, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type PageTransitionPhase = 'idle' | 'exiting'

type TransitionNavigateOptions = {
  to: string
}

type PageTransitionContextValue = {
  navigateWithTransition: (options: TransitionNavigateOptions) => void
}

type StartViewTransition = (
  callback: () => void | Promise<unknown>,
) => { finished: Promise<unknown> }

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
)

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')

    function handleChange() {
      setIsMobile(mediaQuery.matches)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobile
}

function getTransitionConfig(isMobile: boolean) {
  return {
    exitDistance: isMobile ? '-72svh' : '-82svh',
    duration: isMobile ? 0.36 : 0.54,
  }
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobileViewport()
  const { duration } = getTransitionConfig(isMobile)
  const [phase, setPhase] = useState<PageTransitionPhase>('idle')
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setPhase('idle')
  }, [pathname])

  const navigateWithTransition = useCallback(
    ({ to }: TransitionNavigateOptions) => {
      if (to === pathname) {
        return
      }

      window.clearTimeout(timeoutRef.current)

      if (shouldReduceMotion) {
        void navigate({ to })
        return
      }

      const startViewTransition = Reflect.get(document, 'startViewTransition')

      if (typeof startViewTransition === 'function') {
        const transition = (startViewTransition as StartViewTransition).call(
          document,
          () => Promise.resolve(navigate({ to })),
        )

        void transition.finished.finally(() => {
          setPhase('idle')
        })
        return
      }

      setPhase('exiting')
      timeoutRef.current = window.setTimeout(() => {
        void navigate({ to })
      }, duration * 1000)
    },
    [duration, navigate, pathname, shouldReduceMotion],
  )

  const value = useMemo(
    () => ({
      navigateWithTransition,
    }),
    [navigateWithTransition],
  )

  return (
    <PageTransitionContext.Provider value={value}>
      <PageTransitionStateContext.Provider value={{ phase, isMobile }}>
        {children}
      </PageTransitionStateContext.Provider>
    </PageTransitionContext.Provider>
  )
}

const PageTransitionStateContext = createContext<{
  phase: PageTransitionPhase
  isMobile: boolean
}>({
  phase: 'idle',
  isMobile: false,
})

export function usePageTransitionNavigation() {
  return useContext(PageTransitionContext)
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const { phase, isMobile } = useContext(PageTransitionStateContext)
  const { exitDistance, duration } = getTransitionConfig(isMobile)

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      className="xk-page-transition"
      initial={false}
      animate={
        phase === 'exiting'
          ? { y: exitDistance }
          : { y: 0 }
      }
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
