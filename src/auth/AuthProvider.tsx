import { Component, type ReactNode } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthProviderState {
  user: User | null
  loading: boolean
}

export class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {
  private unsubscribe: (() => void) | null = null

  constructor(props: AuthProviderProps) {
    super(props)
    this.state = { user: null, loading: true }
  }

  componentDidMount(): void {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ user, loading: false })
    })
  }

  componentWillUnmount(): void {
    if (this.unsubscribe) this.unsubscribe()
  }

  logout = async (): Promise<void> => {
    await signOut(auth)
  }

  render() {
    const { user, loading } = this.state
    const value: AuthContextValue = { user, loading, logout: this.logout }
    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
