import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Image,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { withMask } from "use-mask-input"
import * as yup from 'yup';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  const loginSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    phone_number: yup
      .string()
      .required('Phone number is required')
      .matches(/^\+?[0-9]\d{9,12}$/, 'Phone number must be valid and contain 10-12 digits'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
      .matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Password must contain at least one symbol'),
    confirm_password: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });  
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  async function submitRegister(data) {
    setLoading(true);
    try {
      await api()
        .post("/user/register", data)
        .then((res) => {
          toast({
            title: res.data.message,
            description: "Register Successful.",
            status: "success",
            position: "top",
            duration: 5000,
            isClosable: true,
          });
        });
        nav("/login");
    } catch (error) {
      alert(error.response.data.message);
    } finally{
      setLoading(false);
    }
  }
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'} display='flex' justifyContent={'center'}>
            <Image
              alt={'Login Image'}
              objectFit={'cover'}
              maxW={'50%'}
              maxH={'10%'}
              src={
                'logo512.png'
              }
            />           
          </Heading>
          <FormControl id="first_name" isInvalid={errors.first_name}>
            <FormLabel>First Name</FormLabel>
            <Input
              {...register('first_name')}
              onBlur={() => trigger('first_name')}
              fontSize={"12px"}
              bgColor={"#fafafa"}
              placeholder="First Name"
              pl={"15px"}              
            />
            <Text color="red.500" fontSize="sm">
              {errors?.first_name?.message}
            </Text>
          </FormControl>
          <FormControl id="last_name">
            <FormLabel>Last Name</FormLabel>
            <Input
              {...register('last_name')}
              fontSize={"12px"}
              bgColor={"#fafafa"}
              placeholder="Last Name"
              pl={"15px"}              
            />            
          </FormControl>
          <FormControl id="phone_number" isInvalid={errors.phone_number}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              {...register('phone_number')}
              onBlur={() => trigger('phone_number')}
              fontSize={"12px"}
              bgColor={"#fafafa"}
              placeholder="Phone Number"
              pl={"15px"}              
            />
            <Text color="red.500" fontSize="sm">
              {errors?.phone_number?.message}
            </Text>
          </FormControl>
          <FormControl id="email" isInvalid={errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              {...register('email')}
              onBlur={() => trigger('email')}
              fontSize={"12px"}
              bgColor={"#fafafa"}
              placeholder="Email"
              pl={"15px"}              
            />
            <Text color="red.500" fontSize="sm">
              {errors.email?.message}
            </Text>
          </FormControl>
          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                {...register('password')}
                onBlur={() => trigger('password')}
                bgColor={"#fafafa"}               
                fontSize={"12px"}
                type={seePassword ? "text" : "password"}
                placeholder="Password"
              ></Input>
              <InputRightElement width={"2.5rem"} h={"100%"}>
                <IconButton
                  colorScheme="whiteAlpha"
                  color={"grey"}
                  as={seePassword ? AiOutlineEye : AiOutlineEyeInvisible}
                  w={"24px"}
                  h={"24px"}
                  onClick={() => setSeePassword(!seePassword)}
                  cursor={"pointer"}
                ></IconButton>
              </InputRightElement>
            </InputGroup>
            <Text color="red.500" fontSize="sm">
              {errors.password?.message}
            </Text>
          </FormControl>
          <FormControl id="confirm_password" isInvalid={errors.confirm_password}>
          <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                {...register('confirm_password')}
                onBlur={() => trigger('confirm_password')}
                bgColor={"#fafafa"}
                fontSize={"12px"}
                type={seePassword ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <InputRightElement width={"2.5rem"} h={"100%"}>
                <IconButton
                  colorScheme="whiteAlpha"
                  color={"grey"}
                  as={seePassword ? AiOutlineEye : AiOutlineEyeInvisible}
                  w={"24px"}
                  h={"24px"}
                  onClick={() => setSeePassword(!seePassword)}
                  cursor={"pointer"}
                />
              </InputRightElement>
            </InputGroup>
            <Text color="red.500" fontSize="sm">
              {errors.confirm_password?.message}
            </Text>
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={ 'row' }
              align={'start'}
              justify={'space-between'}>
              <Checkbox
               isChecked={isChecked}
               onChange={(e) => setIsChecked(e.target.checked)}>
                Agree to Terms and Conditions
              </Checkbox>              
            </Stack>
            <Button 
              id="submit" 
              colorScheme={'blue'} 
              variant={'solid'}
              isLoading={loading}
              isDisabled={!isChecked}
              onClick={handleSubmit(submitRegister)}
            >
              Sign up
            </Button>
            <Flex gap={'4px'} fontSize={14} justifyContent={'center'}>
              <Text>Already have an account?</Text>
              <Link href="/login" 
                color="blue.500" 
                fontWeight="semibold" 
                textDecoration="none" 
                _hover={{ textDecoration: 'underline', color: 'blue.700' }}>
                  Sign in.
              </Link>
            </Flex>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} display={{ base: 'none', sm:'block'}}>
        <Image
          alt={'Login Image'}
          width="100%"
          height="100%"
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
    </Flex>
  )
}